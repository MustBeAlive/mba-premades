import {mba} from "../../helperFunctions.js";

async function dagger({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    let offset = 0;
    if (!workflow.hitTargets.size) offset = 0.6 * target.document.texture.scaleX;
    let type = "melee";
    let distance = mba.getDistance(workflow.token, target);
    if (!distance) return;
    if (distance > 5) type = "ranged";
    if (type === "melee") {
        new Sequence()

            .effect()
            .file("jb2a.dagger.melee.fire.blue")
            .attachTo(token)
            .stretchTo(target)
            .missed(!workflow.hitTargets.size)

            .play()
    }
    else if (type === "ranged") {
        new Sequence()

            .effect()
            .file("jb2a.dagger.throw.01.blue")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offset, y: offset }, gridUnits: true})
            .waitUntilFinished(-700)

            .effect()
            .file("jb2a.dagger.return.01.blue")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offset, y: offset }, gridUnits: true})

            .play()
    }
}

export let returning = {
    'dagger': dagger
}