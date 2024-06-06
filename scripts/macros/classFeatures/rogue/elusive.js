import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function hook(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    if (!constants.attacks.includes(workflow.item.system?.actionType)) return;
    if (!workflow.advantage) return;
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, "Elusive")) return;
    if (mba.findEffect(target.actor, "Incapacitated")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'elusive', 50);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS: Elusive');
    queue.remove(workflow.item.uuid);
}

export let elusive = {
    'hook': hook
}