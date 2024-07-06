import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnStart() {
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'radiantConsumption': {
                            'used': 0
                        }
                    }
                }
            }
        };
        let effect = await mbaPremades.helpers.findEffect(actor, "Radiant Consumption");
        if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
    };
    async function effectMacroTurnEnd() {
        let targetUuids = Array.from(mbaPremades.helpers.findNearby(token, 10, undefined, false, false, false, true)).map(t => t.document.uuid);
        if (!targetUuids.length) return;
        let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Race Feature Items', "Radiant Consumption: Damage", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.damage.parts[0][0] = `${token.actor.system.attributes.prof}[radiant]`;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions(targetUuids);
        new Sequence()

            .effect()
            .file("jb2a.markers.light.complete.yellow")
            .attachTo(token)
            .fadeOut(1000)

            .effect()
            .file("jb2a.markers.light_orb.complete.yellow")
            .attachTo(token)
            .fadeOut(1000)
            .belowTokens()

            .thenDo(async () => {
                await MidiQOL.completeItemUse(feature, config, options);
            })

            .play()
    };
    let effectData = {
        'name': "Radiant Consumption",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Searing light temporarily radiates from your eyes and mouth.</p>
            <p>For the duration, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes radiant damage equal to your proficiency bonus.</p>
            <p>Until the transformation ends, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell.</p>
            <p>The extra damage equals your proficiency bonus.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.radiantConsumption.damage,postDamageRoll',
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 40,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 20,
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
            {
                'key': 'ATL.light.angle',
                'mode': 5,
                'value': "360",
                'priority': 20
            },
            {
                'key': 'ATL.light.luminosity',
                'mode': 5,
                'value': "0.5",
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#ac912f",
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.8",
                'priority': 20
            },
            {
                'key': 'ATL.light.contrast',
                'mode': 5,
                'value': "0.15",
                'priority': 20
            },
            {
                'key': 'ATL.light.shadows',
                'mode': 5,
                'value': "0.2",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                }
            },
            'mba-premades': {
                'feature': {
                    'radiantConsumption': {
                        'used': 0
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(token)
        .fadeOut(1000)

        .effect()
        .file("jb2a.markers.light_orb.complete.yellow")
        .attachTo(token)
        .fadeOut(1000)
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let effect = await mba.findEffect(workflow.actor, "Radiant Consumption");
    if (!effect) return;
    if (effect.flags['mba-premades']?.feature?.radiantConsumption?.used === 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "radiantConsumption", 249);
    if (!queueSetup) return;
    let selection = await mba.dialog("Radiant Consumption", constants.yesNo, `Deal extra damage? (+${workflow.actor.system.attributes.prof}[radiant])`);
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `+${workflow.actor.system.attributes.prof}[radiant]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'radiantConsumption': {
                        'used': 1
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

export let radiantConsumption = {
    'item': item,
    'damage': damage
}