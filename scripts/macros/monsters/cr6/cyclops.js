import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function poorDepthPerception({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.getDistance(workflow.token, target) <= 30) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'poorDepthPerception', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS: Poor Depth Perception");
    queue.remove(workflow.item.uuid);
}

export let cyclops = {
    'poorDepthPerception': poorDepthPerception
}