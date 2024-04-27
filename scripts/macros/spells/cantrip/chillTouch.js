// Original macro by CPR
export async function chillTouch({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size != 1) return;
    let type = chrisPremades.helpers.raceOrType(workflow.actor);
    if (type.toLowerCase() != 'undead') return;
    let effect = chrisPremades.helpers.findEffect(workflow.actor, 'Chill Touch');
    if (!effect) return;
    let sourceActor = await fromUuid(effect.origin);
    let sourceActorId = sourceActor.actor.id;
    if (workflow.targets.first().actor.id != sourceActorId) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'chillTouch', 50);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS: Chill Touch');
    chrisPremades.queue.remove(workflow.item.uuid);
}