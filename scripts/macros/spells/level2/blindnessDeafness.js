async function onCast({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel - 1;
    if (workflow.targets.size <= ammount) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function postSave({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size === 0) return;
    let tempEffectData = {
        'name': 'Blindness Temp',
        'flags': {
            'mba-premades': {
                'spell': {
                    'blindnessDeafness': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                    }
                }
            }
        }
    };
    let effect = await chrisPremades.helpers.createEffect(workflow.actor, tempEffectData);
    let targets = workflow.targets;
    async function loop(targets) {
        let i = targets;
        let choices  = [['Blindness', 'blind'],['Deafness', 'deaf']];
        let selection = await chrisPremades.helpers.dialog('Choose condition for ' + i.document.name, choices);
        if (!selection) {
            return;
        }
        switch (selection) {
            case 'blind': {
                const effectData = {
                    'name': 'Blindness',
                    'icon': 'assets/library/icons/sorted/spells/level2/Blindness.webp',
                    'origin': workflow.item.uuid,
                    'description': 'You are blinded for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.',
                    'duration': {
                        'seconds': 60
                    },
                    'changes': [
                        {
                            'key': 'flags.midi-qol.OverTime',
                            'mode': 0,
                            'value': 'turn=end, saveAbility=con, saveDC=' + effect.flags['mba-premades'].spell.blindnessDeafness.dc + ' , saveMagic=true, name=Blindness',
                            'priority': 20
                        },
                        {
                            'key': 'macro.CE',
                            'mode': 0,
                            'value': 'Blinded',
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'mba-premades': {
                            'spell': {
                                'blindnessDeafness': {
                                    'dc': chrisPremades.helpers.getSpellDC(workflow.item)
                                }
                            }
                        }
                    }
                };
                await chrisPremades.helpers.createEffect(i.actor, effectData);
                break;
            }
            case 'deaf': {
                const effectData = {
                    'name': 'Deafness',
                    'icon': 'assets/library/icons/sorted/spells/level2/Blindness.webp',
                    'origin': workflow.item.uuid,
                    'description': 'You are deafened for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.',
                    'duration': {
                        'seconds': 60
                    },
                    'changes': [
                        {
                            'key': 'flags.midi-qol.OverTime',
                            'mode': 0,
                            'value': 'turn=end, saveAbility=con, saveDC=' + effect.flags['mba-premades'].spell.blindnessDeafness.dc + ' , saveMagic=true, name=Deafness',
                            'priority': 20
                        },
                        {
                            'key': 'macro.CE',
                            'mode': 0,
                            'value': 'Deafened',
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'mba-premades': {
                            'spell': {
                                'blindnessDeafness': {
                                    'dc': chrisPremades.helpers.getSpellDC(workflow.item)
                                }
                            }
                        }
                    }
                };
                await chrisPremades.helpers.createEffect(i.actor, effectData);
            }
        }
    }
    targets.forEach(loop);
}

async function postRoll({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, 'Blindness Temp')
    await chrisPremades.helpers.removeEffect(effect);
}

export let blindnessDeafness = {
    'onCast': onCast,
    'postSave': postSave,
    'postRoll': postRoll
}