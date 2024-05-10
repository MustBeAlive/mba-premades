import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .wait(700)

        .effect()
        .file("jb2a.cast_generic.sound.01.pinkteal.0")
        .attachTo(template)
        .size(1, { gridUnits: true })
        .waitUntilFinished(-1400)

        .effect()
        .file("jb2a.explosion.purple.1")
        .attachTo(template)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.toll_the_dead.purple.shockwave")
        .attachTo(template)
        .size(5.2, { gridUnits: true })
        .fadeOut(300)

        .effect()
        .file("jb2a.soundwave.02.purple")
        .attachTo(template)
        .playbackRate(2)
        .size(5.2, { gridUnits: true })
        .fadeOut(300)

        .effect()
        .file("jb2a.soundwave.02.purple")
        .delay(500)
        .attachTo(template)
        .playbackRate(2)
        .size(5.2, { gridUnits: true })
        .fadeOut(300)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'thunderWave', 50);
    if (!queueSetup) return;
    for (let target of Array.from(workflow.failedSaves)) {
        mba.pushToken(workflow.token, target, 10);
    }
    queue.remove(workflow.item.uuid);
}

export let thunderwave = {
    'cast': cast,
    'item': item
}