import {mba} from "../../../helperFunctions.js";

async function disgorge({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.fire.green.01")
        .atLocation(workflow.token)
        .rotateTowards(template)

        .effect()
        .file("jb2a.grease.dark_green.loop")
        .attachTo(template)
        .scaleToObject(1)
        .delay(1000)
        .fadeIn(2000)
        .fadeOut(5000)

        .thenDo(async () => {
            if (workflow.failedSaves.size) {
                let targets = Array.from(workflow.failedSaves);
                for (let target of targets) {
                    if (!mba.findEffect(target.actor, "Prone")) await mba.addCondition(target.actor, "Prone");
                }
            }
        })

        .play()
}

export let mawDemon = {
    'disgorge': disgorge
}