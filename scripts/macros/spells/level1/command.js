export async function command({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    const target = workflow.targets.first();
    let choices  = [
        ['Approach', 'Appro'],
        ['Drop', 'Drop'],
        ['Flee', 'Flee'],
        ['Grovel', 'Grovel'],
        ['Halt', 'Halt'],
        ['Other', 'Other']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose command:', choices);
    if (!selection) {
        return;
    }
    let effectData;
    switch (selection) {
        case 'Appro': {
            effectData = {
                'name': "Command: Approach",
                'icon': "assets/library/icons/sorted/spells/level1/command_approach.webp",
                'description': "You willingly move to the caster of Command spell by the shortest and most direct route, ending your if you come within 5 feet of the caster.",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                }
            }
            break;
        }
        case 'Drop': {
            effectData = {
                'name': "Command: Drop",
                'icon': "assets/library/icons/sorted/spells/level1/command_drop.webp",
                'description': "You willingly drop whatever you are holding and then end your turn.",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                }
            }
            break;
        }
        case 'Flee': {
            effectData = {
                'name': "Command: Flee",
                'icon': "assets/library/icons/sorted/spells/level1/command_flee.webp",
                'description': "You spend your turn moving away from caster by the fastest available means.",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                }
            }
            break;
        }
        case 'Grovel': {
            effectData = {
                'name': "Command: Grovel",
                'icon': "assets/library/icons/sorted/spells/level1/command_grovel.webp",
                'description': "You fall prone and then ends its turn.",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Prone",
                        'priority': 20
                    }
                ]
            }
            break;
        }
        case 'Halt': {
            effectData = {
                'name': "Command: Halt",
                'icon': "assets/library/icons/sorted/spells/level1/command_halt.webp",
                'description': "You don't move and take no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                }
            }
            break;
        }
        case 'Other': {
            effectData = {
                'name': "Command",
                'icon': "assets/library/icons/sorted/spells/level1/Command_Halt.webp",
                'description': "You follow the custom Command",
                'duration': {
                    'rounds': 1
                },
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd']
                    }
                }
            }
        }
    }
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}