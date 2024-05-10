export async function illusionaryScript({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .wait(1000)

        .effect()
        .file("modules/mba-premades/icons/spells/level1/illusory_script.webp")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .scaleOut(0, 2000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000})

        .play()
}