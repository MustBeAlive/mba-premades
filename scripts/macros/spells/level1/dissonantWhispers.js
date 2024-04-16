async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let deafened = await chrisPremades.helpers.findEffect(target.actor, 'Deafened');
    if (!deafened) return;
    ChatMessage.create({ flavor: target.document.name + ' is deafened and automatically succeeds on the save', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
    let immuneData = {  
        'name': 'Save Immunity',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'description': "You succeed on the next save you make",
        'duration': {
            'turns': 1  
        },
        'changes': [
            {
                'key': 'flags.midi-qol.min.ability.save.all',
                'value': '100',
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
    await chrisPremades.helpers.createEffect(target.actor, immuneData);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let reaction = chrisPremades.helpers.findEffect(target.actor, 'Reaction');
    if (reaction) return;
    async function effectMacro() {
        await new Dialog({
            title: "Dissonant Whispers",
            content: "<p>You must immediately use your reaction to move as far as your speed allows away from the caster of the spell.</p><p>You don't have to move into obviously dangerous ground, such as a fire or a pit.</p>",
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
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "You must immediately use your reaction to move as far as your speed allows away from the caster of the spell. You don't have to move into obviously dangerous ground, such as a fire or a pit.",
        'duration': {
            'rounds': 1
        },
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            },
            'dae': {
                    'specialDuration': ['turnStart']
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Reaction",
                'priority': 20
            }
        ]
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}

export let dissonantWhispers = {
    'cast': cast,
    'item': item
}