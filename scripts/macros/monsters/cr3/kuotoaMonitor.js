import {mba} from "../../../helperFunctions.js";

async function unarmedStrike({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Reaction")) return;
    await mba.addCondition(target.actor, "Reaction");
}

export let kuotoaMonitor = {
    'unarmedStrike': unarmedStrike
}