export async function suggestion({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let target = workflow.targets.first();
    let charmImmune = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
    if (charmImmune) {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        ui.notifications.warn('Target cannot be affected by Suggestion!');
    }
}