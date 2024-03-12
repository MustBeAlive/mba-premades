// Original macro by CPR
export async function thunderwave({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.failedSaves.size) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'thunderWave', 50);
    if (!queueSetup) return;
    for (let i of Array.from(workflow.failedSaves)) {
        chrisPremades.helpers.pushToken(workflow.token, i, 10);
    }
    chrisPremades.queue.remove(workflow.item.uuid);
}