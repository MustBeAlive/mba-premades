export async function shatter({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.energy_strands.in.red.01.0")
        .atLocation(template)
        .scaleToObject(1.4)
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.cast_generic.dark.01.red.0")
        .atLocation(template)
        .scaleToObject(1.2)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.soundwave.01.red")
        .delay(400)
        .atLocation(template)
        .playbackRate(2.1)

        .effect()
        .file("jb2a.soundwave.01.red")
        .delay(550)
        .atLocation(template)
        .playbackRate(2.1)

        .effect()
        .file("jb2a.soundwave.01.red")
        .delay(700)
        .atLocation(template)
        .playbackRate(2.1)

        .effect()
        .file("jb2a.soundwave.01.red")
        .delay(850)
        .atLocation(template)
        .playbackRate(2.1)

        .effect()
        .file("jb2a.soundwave.01.red")
        .delay(1000)
        .atLocation(template)
        .playbackRate(2.1)

        .play()
}