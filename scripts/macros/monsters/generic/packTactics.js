import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function packTactics({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size != 1) return;
    let nearbyTargets = mba.findNearby(workflow.targets.first(), 5, 'enemy', false).filter(i => i.document.uuid != workflow.token.document.uuid && !mba.findEffect(i.actor, "Incapacitated"));
    if (!nearbyTargets.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'packTactics', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Pack Tactics");
    queue.remove(workflow.item.uuid);
}