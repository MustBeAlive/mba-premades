export async function animalFriendship({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let target = workflow.targets.first();
    let effect = await chrisPremades.helpers.findEffect(target.actor, 'Animal Friendship');
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'beast') {
        ui.notifications.warn('Animal Friendship работает только на существ типа "beast"!');
        await chrisPremades.helpers.removeEffect(effect);
        return;
    }
    let targetIntValue = target.actor.system.abilities.int.value;
    if (targetIntValue >= 4) {
        ui.notifications.warn('Animal Friendship работает только на существ с значением интеллекта ниже 4!');
        await chrisPremades.helpers.removeEffect(effect);
        return;
    }
}