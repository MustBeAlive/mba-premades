async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Eyebite: Action', false);
    if (!featureData) return;
    featureData.system.save.dc = mbaPremades.helpers.getSpellDC(workflow.item);
    async function effectMacro() {
        await warpgate.revert(token.document, 'Eyebite: Action');
    }
    let effectData = {
        'label': workflow.item.name,
        'icon': workflow.item.img,
        'duration': {
            'seconds': 60
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mbaPremades.helpers.functionToString(effectMacro)
                }
            },
            'mba-premades': {
                'spell': {
                    'eyebite': {
                        'dc': mbaPremades.helpers.getSpellDC(workflow.item),
                        'name': workflow.token.document.name,
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
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': featureData.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function save({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let effect = mbaPremades.helpers.findEffect(target.actor, "Eyebite: Immunity");
    if (!effect) return;
    let immuneData = {  
        'name': 'Save Immunity',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'description': "You succeed on the next save you make",
        'duration': {
            'turns': 1  
        },
        'changes': [
            {
                'key': 'flags.midi-qol.min.ability.save.wis',
                'value': '40',
                'mode': 2,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': [
                    'isSave'
                ]
            },
            'mba-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    await mbaPremades.helpers.createEffect(target.actor, immuneData);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    const target = workflow.targets.first();
    if (!workflow.failedSaves.size) {
        let effectData = {
            'name': 'Eyebite: Immunity',
            'icon': 'modules/mba-premades/icons/spells/level6/eyebite_immune.webp',
            'duration': {
                seconds: 60
            },
            'description': 'You succesfully saved against one of the Eyebite effects and are immune to any further attempts to cast it on you.',
            'flags': {
                'dae': {
                    'specialDuration': ['combatEnd']
                }
            }
        }
        await mbaPremades.helpers.createEffect(target.actor, effectData);
        return;
    }
    const effect = mbaPremades.helpers.findEffect(workflow.actor, 'Eyebite');
    let choices = [['Asleep', 'sleep'], ['Panicked', 'panic'],['Sickened', 'sick']];
    let selection = await mbaPremades.helpers.dialog('Choose Eyebite effect:', choices);
    if (!selection) return;
    async function effectMacroImm() {
        let effectData = {
            'name': 'Eyebite: Immunity',
            'icon': 'modules/mba-premades/icons/spells/level6/eyebite_immune.webp',
            'duration': {
                seconds: 60
            },
            'description': 'You succesfully saved against one of the Eyebite effects and are immune to any further attempts to cast it on you.',
            'flags': {
                'dae': {
                    'specialDuration': ['combatEnd']
                }
            }
        }
        await mbaPremades.helpers.createEffect(actor, effectData);
    }
    switch (selection) {
        case 'sleep': {
            let effectData = {
                'name': "Eyebite: Asleep",
                'icon': "modules/mba-premades/icons/spells/level6/eyebite_asleep.webp",
                'description': "You fall unconscious. You wake up if you take any damage or if another creature uses its action to shake you awake.",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Unconscious",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                        'specialDuration': ['isDamaged']
                    },
                    'effectmacro': {
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroImm)
                        }
                    }
                }
            };
            let newEffect = await mbaPremades.helpers.createEffect(target.actor, effectData);
            let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
            concData.push(newEffect.uuid);
            await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
            break;
        }
        case 'panic': {
            async function effectMacroStart() {
                await new Dialog({
                    title: "Eyebite: Panicked",
                    content: "<p>You are frightened. On each of your turns you must take the <b>Dash</b> action and move away from the caster of the Eyebite spell by the safest and shortest available route, unless there is nowhere to move.</p><p>If you move to a place at least 60 feet away from the caster of the Eyebite spell where it can no longer see you, this effect ends.</p>",
                    buttons: {
                        ok: {
                            label: "Ok!",
                            callback: async (html) => {
                                return;
                            },
                        },
                    },
                    default: "Ok!"
                }).render(true);
            };
            async function effectMacroEnd() {
                let effect = mbaPremades.helpers.findEffect(actor, 'Eyebite: Panicked');
                let casterName = effect.flags['mba-premades']?.spell?.eyebite?.name;
                let casterNearby = await MidiQOL.findNearby(null, token, 60, { includeIncapacitated: false }).filter(i => i.name === casterName);
                let casterCanSee = await MidiQOL.findNearby(null, token, 200, { includeIncapacitated: false, canSee: true }).filter(i => i.name === casterName);
                if (casterNearby.length === 1 || casterCanSee.length === 1) return;
                await mbaPremades.helpers.removeEffect(effect);
            };
            let effectData = {
                'name': "Eyebite: Panicked",
                'icon': "modules/mba-premades/icons/spells/level6/eyebite_panicked.webp",
                'description': "You are frightened. On each of your turns you must take the Dash action and move away from the caster of the Eyebite spell by the safest and shortest available route, unless there is nowhere to move. If you move to a place at least <b>60 feet</b> away from the caster of the Eyebite spell where it <b>can no longer see you</b>, this effect ends.",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Frightened",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true
                    },
                    'effectmacro': {
                        'onTurnStart': {
                            'script': mbaPremades.helpers.functionToString(effectMacroStart)
                        },
                        'onTurnEnd': {
                            'script': mbaPremades.helpers.functionToString(effectMacroEnd)
                        },
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroImm)
                        }
                    },
                    'mba-premades': {
                        'spell': {
                            'eyebite': {
                                'name': workflow.token.document.name
                            }
                        }
                    }
                }
            };
            await mbaPremades.helpers.createEffect(target.actor, effectData);
            let newEffect = await mbaPremades.helpers.findEffect(target.actor, "Eyebite: Panicked");
            let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
            concData.push(newEffect.uuid);
            await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
            break;
        }
        case 'sick': {
            let effectData = {
                'name': "Eyebite: Sickened",
                'icon': "modules/mba-premades/icons/spells/level6/eyebite_sickened.webp",
                'description': "You have disadvantage on all attack rolls and ability checks. At the end of each of your turns, you can make another Wisdom saving throw. If it succeeds, the effect ends.",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.attack.all',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.check.all',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.OverTime',
                        'mode': 0,
                        'value': 'turn=end, saveAbility=wis, saveDC=' + effect.flags['mba-premades']?.spell?.eyebite?.dc + ' , saveMagic=true, name=Eyebite: Sickened',
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true
                    },
                    'effectmacro': {
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroImm)
                        }
                    }
                }
            };
            await mbaPremades.helpers.createEffect(target.actor, effectData);
            let newEffect = await mbaPremades.helpers.findEffect(target.actor, "Eyebite: Sickened");
            let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
            concData.push(newEffect.uuid);
            await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
        }
    }
}

export let eyebite = {
    'cast': cast,
    'save': save,
    'item': item
}