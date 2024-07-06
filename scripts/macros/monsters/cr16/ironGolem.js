async function poisonBreath({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    
    new Sequence()

        .effect()
        .file("jb2a.breath_weapons.poison.cone.green")
        .attachTo(workflow.token)
        .stretchTo(template)
        .playbackRate(1.5)

        .play()
}

export let ironGolem = {
    'poisonBreath': poisonBreath
}