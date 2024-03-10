export async function beastBond({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'beast') {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        ui.notifications.warn('Beast Bond can only affect beasts!');
        return;
    }
    let targetIntValue = target.actor.system.abilities.int.value;
    if (targetIntValue > 4) {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        ui.notifications.warn('Beast Bond can only affect creatures with Intelligence score of 4 or lower!');
        return;
    }
    let casterDisposition = token.document.disposition;
    let targetDisposition = target.document.disposition;
    let isCharmed = chrisPremades.helpers.findEffect(target.actor, 'Charmed');
    if (casterDisposition < 0) {
        if (targetDisposition > 0 && !isCharmed) {
            await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
            ui.notifications.warn('Beast Bond only affects friendly, neutral or charmed creatures!');
        }
    }
    if (casterDisposition >= 0) {
        if (targetDisposition < 0 && !isCharmed) {
            await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
            ui.notifications.warn('Beast Bond only affects friendly, neutral or charmed creatures!');
        }
    }
}