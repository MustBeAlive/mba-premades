import {queue} from "../../mechanics/queue.js";

export async function bloodFrenzy({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    if (target.actor.system.attributes.hp.value >= target.actor.system.attributes.hp.max) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'bloodFrenzy', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Blood Frenzy");
    queue.remove(workflow.item.uuid);
}