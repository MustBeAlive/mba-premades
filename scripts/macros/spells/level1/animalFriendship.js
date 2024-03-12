export async function animalFriendship({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let target = workflow.targets.first();
    let effect = await chrisPremades.helpers.findEffect(target.actor, 'Animal Friendship');
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'beast') {
        ui.notifications.warn('Animal Friendship can only affect beasts!');
        await chrisPremades.helpers.removeEffect(effect);
        return;
    }
    let targetIntValue = target.actor.system.abilities.int.value;
    if (targetIntValue >= 4) {
        ui.notifications.warn('Animal Friendship can only affect creatures with Intelligence score of 4 or lower!');
        await chrisPremades.helpers.removeEffect(effect);
        return;
    }
}