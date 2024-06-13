export async function stoneEndurance({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .attachTo(workflow.token)
        .scaleToObject(1.4)
        .fadeOut(200)
        .endTime(1200)
        .waitUntilFinished(-400)

        .effect()
        .file("jb2a.shield_themed.above.molten_earth.01.orange")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(2000)

        .play()
}