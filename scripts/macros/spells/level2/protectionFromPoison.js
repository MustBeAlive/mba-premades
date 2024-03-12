export async function protectionFromPoison({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let poisoned = chrisPremades.helpers.findEffect(target.actor, 'Poisoned');
    if (poisoned) {
        await chrisPremades.helpers.removeCondition(target.actor, 'Poisoned');
    }
}