export async function heal({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let ammount = (workflow.castData.castLevel * 10) + 10;
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Heal has no effect on undead and construct creatures!');
        return false;
    }
    await chrisPremades.helpers.applyDamage([target], ammount, 'healing');
    let hasBlindness = await chrisPremades.helpers.findEffect(target.actor, 'Blinded');
    if (hasBlindness) await chrisPremades.helpers.removeCondition(target.actor, 'Blinded');
    let hasDeafness = await chrisPremades.helpers.findEffect(target.actor, 'Deafened');
    if (hasDeafness) await chrisPremades.helpers.removeCondition(target.actor, 'Deafened');
}