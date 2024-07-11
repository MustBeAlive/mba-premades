export async function snillocSnowballSwarm({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let offset = [
        { x: 0, y: -0.45 },
        { x: -0.5, y: 0.15 },
        { x: 0.8, y: 0.45 },
        { x: -0.4, y: -0.55 },
        { x: -0.7, y: 0.55 },
        { x: 0.6, y: -0.45 },
        { x: 0.4, y: 0.1 },
    ];
    await Sequencer.Preloader.preload('jb2a.snowball_toss.white.01');
    await new Sequence()

        .effect()
        .file("jb2a.cast_generic.ice.01.blue.0")
        .attachTo(workflow.token)
        .scaleToObject(1.8)
        .playbackRate(2)
        .waitUntilFinished(-600)

        .play()

    new Sequence()

        .effect()
        .file("jb2a.impact.frost.blue.01")
        .attachTo(template)
        .scaleToObject(1.5)
        .delay(1300)
        .fadeOut(1000)
        .belowTokens()

        .play()

    for (let i = 0; i < offset.length; i++) {
        let delay = 200 + Math.floor(Math.random() * (Math.floor(300) - Math.ceil(50)) + Math.ceil(50));
        new Sequence()

            .effect()
            .file("jb2a.snowball_toss.white.01")
            .attachTo(workflow.token)
            .stretchTo(template, { offset: offset[i], gridUnits: true, followRotation: false })
            .delay(delay)

            .play()
    }
}