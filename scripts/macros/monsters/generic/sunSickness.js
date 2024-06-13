import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function sunSickness({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.checkLight(workflow.token) != "bright") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'sunSickness', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS:Sun Sickness");
    queue.remove(workflow.item.uuid);
}