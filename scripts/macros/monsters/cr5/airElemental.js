import {mba} from "../../../helperFunctions.js";

async function whirlwind({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.whirlwind.bluegrey")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(1000)

        .play()

    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        mba.pushToken(workflow.token, target, 20);
        if (!mba.findEffect(target.actor, "Prone") && !mba.checkTrait(target.actor, "ci", "Prone")) mba.addCondition(target.actor, "Prone");
    }
}

export let airElemental = {
    'whirlwind': whirlwind
}