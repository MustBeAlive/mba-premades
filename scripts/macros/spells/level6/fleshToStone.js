export async function fleshToStone({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let choices = [['Yes', 'yes'], ['No', 'no']];
    let selection = await mbaPremades.helpers.dialog('Is target made of flesh? (Ask your GM)', choices);
    if (selection === 'no') return;
    let target = workflow.targets.first();
    async function effectMacroEnd() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Flesh to Stone: Restrained");
        if (!effect) return;
        let success = effect.flags['mba-premades']?.spell?.fleshToStone?.success;
        let fail = effect.flags['mba-premades']?.spell?.fleshToStone?.fail;
        let saveDC = effect.flags['mba-premades']?.spell?.fleshToStone?.saveDC;
        let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
        if (saveRoll.total < saveDC) fail += 1;
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
        await new Dialog({
            title: "Flesh to Stone progress:",
            content: `<p><b>Success:</b> ${success}</p><p><b>Fails:</b> ${fail}</p>`,
            buttons: {
                ok: {
                    label: "Ok!"
                }
            }
        }).render(true);
        if (effect.flags['mba-premades']?.spell?.fleshToStone?.success > 2) await mbaPremades.helpers.removeEffect(effect);
        if (effect.flags['mba-premades']?.spell?.fleshToStone?.fail > 2) {
            async function effectMacroPermanent() {
                let effect = await mbaPremades.helpers.findEffect(actor, "Flesh to Stone: Petrification");
                let duration = effect.duration.remaining;
                if (duration > 6) return;
                async function effectMacro() {
                    await Sequencer.EffectManager.endEffects({ name: "Flesh to Stone", object: token })
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
                    .file("https://i.imgur.com/4P2tITB.png")
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
            async function effectMacroDel() {
                await Sequencer.EffectManager.endEffects({ name: "Flesh to Stone", object: token })
            }
            let effectData = {
                'name': "Flesh to Stone: Petrification",
                'icon': effect.flags['mba-premades']?.spell?.fleshToStone?.icon,
                'origin': effect.flags['midi-qol']?.castData.itemUuid,
                'description': "You are subjected to petrified condition for the duration. If caster of the 'Flesh to Stone' spell manages to maintain his concentration for the remaining time, petrification effect becomes permanent.",
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
                .file("https://i.imgur.com/4P2tITB.png")
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
        'description': "<p>You are affected by 'Flesh to Stone' spell and begin to turn into stone.</p><p>You are restrained for the duration and must make another Constitution saving throw at the end of each of your turns. If you successfuly save against this spell three times, the spell ends. If you fail your save three times, you turn into stone and are subjected to the petrified condition for the duration.</p>",
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
                    'script': mbaPremades.helpers.functionToString(effectMacroEnd)
                }
            },
            'mba-premades': {
                'spell': {
                    'fleshToStone': {
                        'saveDC': mbaPremades.helpers.getSpellDC(workflow.item),
                        'success': 0,
                        'fail': 0,
                        'icon': workflow.item.img
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
    await mbaPremades.helpers.createEffect(target.actor, effectData)
}