import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//To do: animations

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 3;
    let concEffect = await mba.findEffect(workflow.actor, 'Concentrating');
    if (workflow.targets.size > ammount) {
        await mba.playerDialogMessage();
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        await mba.clearPlayerDialogMessage();
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            await mba.removeEffect(concEffect);
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        await mba.updateTargets(newTargets);
    }
    let targets = Array.from(game.user.targets);
    if (mba.within30(targets) === false) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other, try again!')
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    await warpgate.wait(100);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'elementalBane': {
                        'dc': mba.getSpellDC(workflow.item),
                        'sourceEffectUuid': concEffect.uuid
                    }
                }
            }
        }
    };
    await mba.updateEffect(concEffect, updates);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Elemental Bane: Save", false);
    if (!featureData) return;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(targets).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let concEffect = mba.findEffect(workflow.actor, 'Concentrating');
    if (!workflow.failedSaves.size) {
        await mba.removeEffect(concEffect);
        return;
    }
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        let choices = [
            ['Acid 🧪', 'acid'],
            ['Cold ❄️', 'cold'],
            ['Fire 🔥', 'fire'],
            ['Lightning ⚡', 'lightning'],
            ['Thunder ☁️', 'thunder']
        ];
        await mba.playerDialogMessage();
        let selection = await mba.dialog("Elemental Bane", choices, `Choose damage type for <u>${target.document.name}</u>:`);
        await mba.clearPlayerDialogMessage();
        if (!selection) return;
        async function effectMacroEachTurn() {
            let effect = mbaPremades.helpers.findEffect(token.actor, 'Elemental Bane');
            let updates = {
                'flags': {
                    'mba-premades': {
                        'spell': {
                            'elementalBane': {
                                'used': false
                            }
                        }
                    }
                }
            };
            if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
        }
        const effectData = {
            'name': 'Elemental Bane',
            'icon': workflow.item.img,
            'origin': concEffect.origin,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.elementalBane.damage,preTargetDamageApplication',
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 0,
                    'value': '-' + selection,
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroEachTurn)
                    }
                },
                'mba-premades': {
                    'spell': {
                        'elementalBane': {
                            'type': selection,
                            'used': false
                        }
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 4,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        let newEffect = await mba.createEffect(target.actor, effectData);
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(actor, 'Elemental Bane');
    if (effect.flags['mba-premades']?.spell?.elementalBane?.used === true) return;
    let type = effect.flags['mba-premades']?.spell?.elementalBane?.type;
    let typeCheck = workflow.damageDetail?.some(d => d.type === type);
    if (!typeCheck) return;
    let damageFormula = `2d6[${type}]`;
    if (workflow.damageItem.critical === true) damageFormula = `4d6[${type}]`;
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll);
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: '<b>Elemental Bane: Bonus Damage</b>'
    });
    let damageTotal = damageRoll.total;
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': type
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'elementalBane': {
                        'used': true
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

export let elementalBane = {
    'cast': cast,
    'item': item,
    'damage': damage
}