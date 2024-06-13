export async function heal({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let ammount = (workflow.castData.castLevel * 10) + 10;
    let type = mbaPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Heal has no effect on undead and construct creatures!');
        return false;
    }
    await mbaPremades.helpers.applyDamage([target], ammount, 'healing');
    let hasBlindness = await mbaPremades.helpers.findEffect(target.actor, 'Blinded');
    if (hasBlindness) await mbaPremades.helpers.removeCondition(target.actor, 'Blinded');
    let hasDeafness = await mbaPremades.helpers.findEffect(target.actor, 'Deafened');
    if (hasDeafness) await mbaPremades.helpers.removeCondition(target.actor, 'Deafened');
}