export async function divination({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.blue02")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(500)
        .duration(16000)
        .fadeOut(2000)

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.blue")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle1.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .name("line1")

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.blue")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle2.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .name("line2")

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.blue")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle3.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .name("line3")

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.blue")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle4.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .name("line4")

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.blue")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle5')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle5.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .delay(5000)
        .duration(11000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .name("line5")

        .effect()
        .file("jb2a.magic_signs.rune.divination.complete.blue")
        .atLocation(workflow.token, {offset: { x : 0.3 }, gridUnits: true })
        .scale(0.5)
        .delay(6000)
        .fadeIn(1000)
        .fadeOut(2000)
        .duration(8667)
        .mirrorX()

        .effect()
        .file("jb2a.magic_signs.rune.02.complete.08.blue")
        .atLocation(workflow.token, {offset: { x: -0.05, y: 0.22 }, gridUnits: true })
        .rotate(90)
        .scale(0.3)
        .delay(6000)
        .fadeIn(1000)
        .fadeOut(2000)
        .duration(8667)

        .effect()
        .file("jb2a.magic_signs.rune.divination.complete.blue")
        .atLocation(workflow.token, {offset: { x : -0.3 }, gridUnits: true })
        .scale(0.5)
        .delay(6000)
        .fadeIn(1000)
        .fadeOut(2000)
        .duration(8667)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle5outro')

        .play()
}