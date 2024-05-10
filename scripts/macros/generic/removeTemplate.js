import {mba} from "../../helperFunctions.js";

export async function removeTemplate({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = mba.findEffect(workflow.actor, workflow.item.name + ' Template');
    if (!effect) return;
    let updates = {
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': 'await effect.delete();'
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}