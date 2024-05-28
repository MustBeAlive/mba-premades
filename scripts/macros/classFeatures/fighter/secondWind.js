export async function secondWind({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(token)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .play()
}