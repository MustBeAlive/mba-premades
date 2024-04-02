// Based on CPR macro (imo, buttons > dropdown)
export async function skillEmpowerment({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => target.actor.system.skills[key].value === 1).map(([i, j]) => ({'value': i, 'html': j.label}));
    let choices = [];
    for (let i = 0; i < options.length; i++) {
        choices.push([options[i].html, options[i].value]);
    }
    let selection = await chrisPremades.helpers.dialog('Choose one of the skills:', choices);
    if (!selection) return;
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "For the next hour, you have expertise in one skill of your choosing.",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.skills.' + selection +'.value',
                'mode': 4,
                'value': 2,
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}