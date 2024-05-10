export async function hellishRebuke({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.cast_generic.fire.01.orange.0")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .waitUntilFinished(-900)

        .effect()
        .file("animated-spell-effects-cartoon.fire.49")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.flames.orange.03.1x1.0")
        .attachTo(target, { offset: { x: 0, y: -0.15 }, gridUnits: true })
        .delay(500)
        .scaleToObject(1.4)
        .belowTokens(false)
        .opacity(0.8)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()

        .play()
}