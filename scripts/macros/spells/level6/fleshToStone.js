import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: cast animation

export async function fleshToStone({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "petrified")) {
        ui.notifications.warn("Target is immune to Petrified condition!");
        return;
    }
    await mba.gmDialogMessage();
    let selectionGM = await mba.remoteDialog("Flesh to Stone", constants.yesNo, game.users.activeGM.id, `Is <b>${target.document.name}</b> made of flesh?`);
    await mba.clearGMDialogMessage();
    if (!selectionGM) {
        ui.notifications.info("Target is not made of flesh!");
        return;
    }
    async function effectMacroEnd() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Flesh to Stone: Restrained");
        if (!effect) return;
        let success = effect.flags['mba-premades']?.spell?.fleshToStone?.success;
        let fail = effect.flags['mba-premades']?.spell?.fleshToStone?.fail;
        let featureData = await mbaPremades.helpers.getItemFromCompendium("mba-premades.MBA Spell Features", "Flesh to Stone: Save", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.save.dc = effect.flags['mba-premades']?.spell?.fleshToStone?.saveDC;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (featureWorkflow.failedSaves.size) fail += 1;
        else success += 1;
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'fleshToStone': {
                            'success': success,
                            'fail': fail
                        }
                    }
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
        mbaPremades.helpers.dialog("Flesh to Stone: Progress", [["Ok", true]], `<p><b>Success:</b> ${success}</p><p><b>Fails:</b> ${fail}</p>`);
        if (effect.flags['mba-premades']?.spell?.fleshToStone?.success > 2) await mbaPremades.helpers.removeEffect(effect);
        if (effect.flags['mba-premades']?.spell?.fleshToStone?.fail > 2) {
            async function effectMacroPermanent() {
                let effect = await mbaPremades.helpers.findEffect(actor, "Flesh to Stone: Petrification");
                let duration = effect.duration.remaining;
                if (duration > 6) return;
                async function effectMacro() {
                    Sequencer.EffectManager.endEffects({ name: `${token.document.name} FTS` })
                }
                let effectData = {
                    'name': "Flesh to Stone: Petrification",
                    'icon': effect.flags['mba-premades']?.spell?.fleshToStone?.icon,
                    'description': "You have permanently turned into stone.",
                    'changes': [
                        {
                            'key': 'macro.CE',
                            'mode': 0,
                            'value': "Petrified",
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'dae': {
                            'showIcon': true,
                        },
                        'effectmacro': {
                            'onDelete': {
                                'script': mbaPremades.helpers.functionToString(effectMacro)
                            }
                        }
                    }
                };
                await mbaPremades.helpers.removeEffect(effect);
                await mbaPremades.helpers.createEffect(actor, effectData);

                new Sequence()

                    .effect()
                    .from(token)
                    .atLocation(token)
                    .attachTo(token)
                    .duration(5000)
                    .fadeIn(3000)
                    .fadeOut(1000)
                    .opacity(0.4)
                    .zIndex(1)
                    .filter("ColorMatrix", { contrast: 1, saturate: -1 })
                    .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                    .mask(token)
                    .persist()
                    .name(`${token.document.name} FTS`)

                    .effect()
                    .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
                    .atLocation(token)
                    .attachTo(token)
                    .fadeIn(3000)
                    .fadeOut(1000)
                    .duration(5000)
                    .opacity(1)
                    .zIndex(0)
                    .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                    .mask(token)
                    .persist()
                    .name(`${token.document.name} FTS`)

                    .play()
            }
            async function effectMacroDel() {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} FTS` })
            }
            let effectData = {
                'name': "Flesh to Stone: Petrification",
                'icon': effect.flags['mba-premades']?.spell?.fleshToStone?.icon,
                'origin': effect.flags['midi-qol']?.castData.itemUuid,
                'description': `
                    <p>You are subjected to petrified condition for the duration.</p>
                    <p>If caster of the Flesh to Stone spell manages to maintain his concentration for the remaining time, petrification effect becomes permanent.
                `,
                'duration': {
                    'seconds': effect.duration.remaining,
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Petrified",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                    },
                    'effectmacro': {
                        'onTurnStart': {
                            'script': mbaPremades.helpers.functionToString(effectMacroPermanent)
                        },
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroDel)
                        }
                    },
                    'mba-premades': {
                        'spell': {
                            'fleshToStone': {
                                'icon': effect.flags['mba-premades']?.spell?.fleshToStone?.icon
                            }
                        }
                    }
                }
            };
            await mbaPremades.helpers.createEffect(actor, effectData);
            await mbaPremades.helpers.removeEffect(effect);

            new Sequence()

                .effect()
                .from(token)
                .atLocation(token)
                .mask(token)
                .opacity(0.4)
                .filter("ColorMatrix", { contrast: 1, saturate: -1 })
                .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                .attachTo(token)
                .fadeIn(3000)
                .duration(5000)
                .zIndex(1)
                .persist()
                .name("Flesh to Stone")

                .effect()
                .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
                .atLocation(token)
                .mask(token)
                .opacity(1)
                .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                .zIndex(0)
                .fadeIn(3000)
                .duration(5000)
                .attachTo(token)
                .persist()
                .name("Flesh to Stone")

                .play()
        }
    }
    let effectData = {
        'name': "Flesh to Stone: Restrained",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Flesh to Stone spell and begin to turn into stone.</p>
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} for the duration and must make another Constitution saving throw at the end of each of your turns.</p>
            <p>If you successfuly save against this spell three times, the spell ends.</p>
            <p>If you fail your save three times, you turn into stone and are subjected to the @UUID[Compendium.mba-premades.MBA SRD.Item.rrTzCb9szWTmyXwH]{Petrified} condition for the duration.</p>
        `,
        'duration': {
            'seconds': 66
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroEnd)
                }
            },
            'mba-premades': {
                'spell': {
                    'fleshToStone': {
                        'fail': 0,
                        'icon': workflow.item.img,
                        'saveDC': mba.getSpellDC(workflow.item),
                        'success': 0,
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData)
}