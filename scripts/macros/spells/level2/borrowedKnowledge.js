// Based on CPR macro (imo, buttons > dropdown)
export async function borrowedKnowledge({speaker, actor, token, character, item, args, scope, workflow}) {
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => workflow.actor.system.skills[key].value < 1).map(([i, j]) => ({'value': i, 'html': j.label}));
    let choices = [];
    for (let i = 0; i < options.length; i++) {
        choices.push([options[i].html, options[i].value]);
    }
    let selection = await chrisPremades.helpers.dialog('Choose one of the skills:', choices);
    if (!selection) {
        return;
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "For the next hour, you are proficient in one skill of your choosing.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.skills.' + selection +'.value',
                'mode': 4,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effect = chrisPremades.helpers.findEffect(workflow.actor, workflow.item.name);
    if (effect) await chrisPremades.helpers.removeEffect(effect);
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}