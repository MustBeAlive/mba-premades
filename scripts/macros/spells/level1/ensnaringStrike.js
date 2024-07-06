import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EnsStr` });
        let targetEffect = await fromUuid(effect.flags['mba-premades']?.spell?.ensnaringStrike?.targetEffectUuid);
        if (!targetEffect) return;
        await mbaPremades.helpers.removeEffect(targetEffect);
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.ensnaringStrike.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'ensnaringStrike': {
                        'dc': mba.getSpellDC(workflow.item),
                        'level': workflow.castData.castLevel,
                        'used': false
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.token_border.circle.static.green.001")
        .attachTo(workflow.token)
        .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1500)
        .persist()
        .name(`${workflow.token.document.name} EnsStr`)

        .play()

    let effect = await mba.createEffect(workflow.actor, effectData);
    let updates = {
        'flags.mba-premades.spell.ensnaringStrike.targetEffectUuid': effect.uuid
    };
    await mba.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.ensnaringStrike);
    if (!effect) return;
    if (effect.flags['mba-premades'].spell.ensnaringStrike.used) return;
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Ensnaring Strike: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let saveDC = effect.flags['mba-premades'].spell.ensnaringStrike.dc;
    featureData.system.save.dc = saveDC;
    let icon = "modules/mba-premades/icons/spells/level1/ensnaring_strike_melee.webp"
    if (workflow.item.system.actionType === "rwak") icon = "modules/mba-premades/icons/spells/level1/ensnaring_strike_ranged.webp";
    featureData.img = icon;
    if (mba.getSize(target.actor) > 2) await mba.createEffect(target.actor, constants.advantageEffectData);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EnsStr` });
        let originEffect = await fromUuid(effect.origin);
        if (!originEffect) return;
        await mbaPremades.helpers.removeEffect(originEffect);
    }
    let effectData = {
        'name': 'Ensnaring Strike: Vines',
        'icon': effect.icon,
        'origin': effect.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by thorny vines and take piercing damage at the start of each of your turns.</p>
            <p>You, or any creature that can touch you can use its action to make a Strength ability check. On a success, the effect ends.</p>
        `,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${saveDC}, saveMagic=true, name=Vines: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageBeforeSave=true, damageType=piercing, damageRoll=${effect.flags['mba-premades'].spell.ensnaringStrike.level}d6[piercing], name=Vines: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: effect.flags['midi-qol'].castData.castLevel,
                    itemUuid: effect.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.swirling_leaves.outburst.01.greenorange")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .waitUntilFinished(-2000)

        .effect()
        .file('jb2a.entangle.green')
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .zIndex(1)
        .mask()
        .persist()
        .name(`${target.document.name} EnsStr`)

        .play()

    let targetEffect = await mba.createEffect(target.actor, effectData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'ensnaringStrike': {
                        'used': true,
                        'targetEffectUuid': targetEffect.uuid
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

export let ensnaringStrike = {
    'damage': damage,
    'item': item
}