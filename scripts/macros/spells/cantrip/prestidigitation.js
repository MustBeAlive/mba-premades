export async function prestidigitation({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.particle_burst.01.circle.yellow")
        .attachTo(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .playbackRate(0.9)
        .opacity(0.7)
        .fadeIn(500)

        .effect()
        .file("jb2a.markers.circle_of_stars.yellowblue")
        .delay(1700)
        .attachTo(token)
        .scaleToObject(1.3 * token.document.texture.scaleX)
        .duration(6000)
        .fadeIn(500)
        .fadeOut(1000)
        .playbackRate(0.8)
        .mask()

        .play()
}