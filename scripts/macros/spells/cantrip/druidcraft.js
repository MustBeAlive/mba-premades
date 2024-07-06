export async function druidcraft({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.particle_burst.01.circle.green")
        .attachTo(workflow.token)
        .scaleToObject(2.5 * workflow.token.document.texture.scaleX)
        .playbackRate(0.9)
        .opacity(0.7)
        .fadeIn(500)
        .filter("ColorMatrix", { hue: 320 })

        .effect()
        .file("jb2a.markers.circle_of_stars.green")
        .delay(1700)
        .attachTo(workflow.token)
        .scaleToObject(1.3 * workflow.token.document.texture.scaleX)
        .duration(6000)
        .fadeIn(500)
        .fadeOut(1000)
        .playbackRate(0.8)
        .mask()

        .play()
}