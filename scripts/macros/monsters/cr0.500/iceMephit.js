async function frostBreathCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.ice.02")
        .attachTo(workflow.token)
        .stretchTo(template)

        .play()
}

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.08.1200.blue")
        .attachTo(token)
        .size(4.5, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

export let iceMephit = {
    'frostBreathCast': frostBreathCast,
    'deathBurstCast': deathBurstCast
}