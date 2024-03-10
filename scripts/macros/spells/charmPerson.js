export async function charmPerson({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = workflow.targets;
    async function loop(targets) {
        let target = targets;
        let type = chrisPremades.helpers.raceOrType(target.actor);
        let immuneData = {
            'name': 'Save Immunity',
            'icon': 'assets/library/icons/sorted/generic/generic_buff.png',
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
                'chris-premades': {
                    'effect': {
                        'noAnimation': true
                    }
                }
            }
        };
        if (type != 'humanoid') {
            ChatMessage.create({ flavor: target.name + ' is unaffected by charm! (not humanoid)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
            await chrisPremades.helpers.createEffect(target.actor, immuneData);
            return;
        }
        let hasCharmImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
        if (hasCharmImmunity) {
            ChatMessage.create({ flavor: target.name + ' is unaffected by charm! (immune to condition: Charmed)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
            await chrisPremades.helpers.createEffect(target.actor, immuneData);
            return;
        }
        if (chrisPremades.helpers.inCombat()) {
            let effectData = {
                'name': 'Save Advantage',
                'icon': 'assets/library/icons/sorted/generic/generic_buff.png',
                'description': "You have advantage on the next save you make",
                'duration': {
                    'turns': 1
                },
                'changes': [
                    {
                        'key': 'flags.midi-qol.advantage.ability.save.all',
                        'value': '1',
                        'mode': 5,
                        'priority': 120
                    }
                ],
                'flags': {
                    'dae': {
                        'specialDuration': [
                            'isSave'
                        ]
                    },
                    'chris-premades': {
                        'effect': {
                            'noAnimation': true
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
    }
    targets.forEach(loop);
}