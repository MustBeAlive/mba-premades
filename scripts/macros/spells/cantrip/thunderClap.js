export async function thunderClap({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.thunderwave.center.blue")
        .attachTo(workflow.token)
        .size(3, { gridUnits: true })

        .effect()
        .file("jb2a.soundwave.02.blue")
        .attachTo(workflow.token)
        .size(4.5, { gridUnits: true })
        .delay(200)
        .playbackRate(2)

        .play()

    for (let target of Array.from(workflow.targets)) {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.electricity.35")
            .delay(700)
            .attachTo(target)
            .scaleToObject(1.7)

            .play()
    }
}