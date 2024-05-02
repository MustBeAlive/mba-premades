export async function minorIllusion({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.spell_projectile.sound.01.pinkteal")
        .attachTo(token)
        .stretchTo(template)
        .waitUntilFinished(-900)

        .effect()
        .file("jb2a.template_circle.out_pulse.01.burst.purplepink")
        .attachTo(template)
        .size(1, { gridUnits: true })
        .duration(2000)
        .fadeOut(300)
        .playbackRate(0.9)
        .persist()

        .effect()
        .file("jb2a.soundwave.01.purple")
        .attachTo(template)
        .size(1.5, { gridUnits: true })
        .duration(2000)
        .fadeOut(300)
        .playbackRate(0.9)
        .persist()
        
        .play()
}