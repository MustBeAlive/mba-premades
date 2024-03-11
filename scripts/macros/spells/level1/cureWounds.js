export async function cureWounds({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    if (target.document.uuid === token.document.uuid) return;
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Cure Wounds has no effect on undead and construct creatures!');
        return false;
    }
}