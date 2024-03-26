export async function blur(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    let validTypes = [
        'mwak',
        'rwak',
        'msak',
        'rsak'
    ];
    if (!validTypes.includes(workflow.item.system?.actionType)) return;
    let targetActor = workflow.targets.first().actor;
    let targetEffect = chrisPremades.helpers.findEffect(targetActor, "Blur");
    if (!targetEffect) return;
    let blindsight = workflow.actor.system.attributes.senses.blindsight;
    let truesight = workflow.actor.system.attributes.senses.truesight;
    if (!blindsight && !truesight) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'blur', 50);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add('ADV: Ignores disadvantage (has Blindsight/Truesight)');
    chrisPremades.queue.remove(workflow.item.uuid);
}