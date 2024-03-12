// Original macro by CPR
export async function removeTemplate({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = chrisPremades.helpers.findEffect(workflow.actor, workflow.item.name + ' Template');
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
    await chrisPremades.helpers.updateEffect(effect, updates);
}