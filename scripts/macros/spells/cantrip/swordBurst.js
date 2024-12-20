export async function swordBurst({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.markers.light_orb.complete.blue")
        .atLocation(workflow.token)
        .scale(0.5)
        .playbackRate(1.5)
        .duration(3100)
        .scaleOut(0, 2000, { ease: "easeOutCubic" })

        .effect()
        .delay(700)
        .file("jb2a.energy_strands.overlay.blue.01")
        .atLocation(workflow.token)
        .scale(0.1)
        .playbackRate(2.5)
        .duration(2400)
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .scaleOut(0, 2000, { ease: "easeOutCubic" })

        .wait(500)

        .effect()
        .file("jb2a.energy_strands.complete.blue.01")
        .atLocation(workflow.token)
        .scaleToObject(5)
        .playbackRate(2.5)
        .belowTokens()
        .duration(2400)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(1000, { ease: "easeOutCubic" })
        .scaleOut(0, 2000, { ease: "easeOutCubic" })
        .opacity(0.75)

        .effect()
        .file("jb2a.melee_attack.01.shortsword.01.2")
        .atLocation(workflow.token)
        .stretchTo(workflow.token, { offset: { x: 0.75 * workflow.token.document.width, y: -0.75 * workflow.token.document.width }, gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .rotateIn(360, 1700, { ease: "easeOutCubic" })
        .fadeOut(500)
        .opacity(1)
        .tint("#aafeff")
        .filter("ColorMatrix", { brightness: 1.2 })

        .effect()
        .file("jb2a.melee_attack.01.shortsword.01.2")
        .atLocation(workflow.token)
        .stretchTo(workflow.token, { offset: { x: -0.75 * workflow.token.document.width, y: -0.75 * workflow.token.document.width }, gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .rotateIn(360, 1700, { ease: "easeOutCubic" })
        .fadeOut(500)
        .opacity(1)
        .tint("#aafeff")
        .filter("ColorMatrix", { brightness: 1.2 })

        .effect()
        .file("jb2a.melee_attack.01.shortsword.01.2")
        .atLocation(workflow.token)
        .stretchTo(workflow.token, { offset: { x: 0.75 * workflow.token.document.width, y: 0.75 * workflow.token.document.width }, gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .rotateIn(360, 1700, { ease: "easeOutCubic" })
        .fadeOut(500)
        .opacity(1)
        .tint("#aafeff")
        .filter("ColorMatrix", { brightness: 1.2 })

        .effect()
        .file("jb2a.melee_attack.01.shortsword.01.2")
        .atLocation(workflow.token)
        .stretchTo(workflow.token, { offset: { x: -0.75 * workflow.token.document.width, y: 0.75 * workflow.token.document.width }, gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .rotateIn(360, 1700, { ease: "easeOutCubic" })
        .fadeOut(500)
        .opacity(1)
        .tint("#aafeff")
        .filter("ColorMatrix", { brightness: 1.2 })

        .play()

    for (let target of Array.from(workflow.targets)) {
        new Sequence()

            .effect()
            .delay(600)
            .from(target)
            .attachTo(target)
            .fadeIn(200)
            .fadeOut(500)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 50, pingPong: true, gridUnits: true })
            .scaleToObject(target.document.texture.scaleX)
            .duration(2500)
            .opacity(0.25)
            .filter("ColorMatrix", { saturate: 1 })

            .play()
    }
}