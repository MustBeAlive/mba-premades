async function fireBurst({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.fire_bolt.orange")
        .atLocation(workflow.token)
        .stretchTo(template)
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.explosion.03")
        .attachTo(template)
        .scaleToObject(1)

        .effect()
        .file("animated-spell-effects-cartoon.fire.explosion.04")
        .attachTo(template)
        .scaleToObject(1)

        .play()
}

export let giantStrider = {
    'fireBurst': fireBurst
}