export async function thunderClap({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    new Sequence()

        .effect()
        .file("jb2a.thunderwave.center.blue")
        .attachTo(token)
        .size(3, { gridUnits: true })

        .effect()
        .file("jb2a.soundwave.02.blue")
        .attachTo(token)
        .delay(200)
        .size(4.5, { gridUnits: true })
        .playbackRate(2)

        .play()

    for (let target of targets) {

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.electricity.35")
            .delay(700)
            .attachTo(target)
            .scaleToObject(1.7)

            .play()
    }
}