export async function mending({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.healing word.yellow")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.sacred_flame.yellow")
        .attachTo(token)
        .delay(450)
        .belowTokens()
        .scaleToObject(2.2 * token.document.texture.scaleX)
        .playbackRate(0.8)

        .effect()
        .file("animated-spell-effects-cartoon.misc.mend")
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .delay(250)
        .filter("ColorMatrix", { hue: 310 })
        .playbackRate(0.8)

        .play()
}