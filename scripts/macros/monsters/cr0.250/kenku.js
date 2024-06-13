import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function ambusher({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.inCombat) return;
    if (game.combat.round > 1) return;
    if (!mba.findEffect(workflow.targets.first().actor, "Surprised")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'ambusher', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Ambusher");
    queue.remove(workflow.item.uuid);
}

export let kenku = {
    'ambusher': ambusher
}