export async function moldEarth({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .wait(700)

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .attachTo(workflow.token)
        .scaleToObject(2.2 * workflow.token.document.texture.scaleX)
        .endTime(600)
        .fadeOut(200)
        .belowTokens()
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.burrow.out.01.brown.1")
        .attachTo(workflow.token)
        .size(3, { gridUnits: true })
        .belowTokens()

        .play()
}