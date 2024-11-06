import {mba} from "../../../helperFunctions.js";

async function harpoon({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let targetRoll = await mba.rollRequest(target, "abil", "str");
    let sourceRoll = await mba.rollRequest(workflow.token, "abil", "str");
    if (targetRoll.total >= sourceRoll.total) return;
    let distance = await mba.getDistance(workflow.token, target);
    if (distance >= 25) distance = 20;
    else distance = distance - 5;
    await mba.pushToken(workflow.token, target, -distance);
}

export let merrow = {
    'harpoon': harpoon
}