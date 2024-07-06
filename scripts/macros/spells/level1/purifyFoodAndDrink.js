export async function purifyFoodAndDrink({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.cast_generic.water.02.blue.0")
        .attachTo(workflow.token)
        .scaleToObject(1.9 * workflow.token.document.texture.scaleX)
        .fadeIn(1000)
        .waitUntilFinished(-1500)

        .effect()
        .file("animated-spell-effects-cartoon.water.61")
        .attachTo(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .playbackRate(0.8)

        .play()
}