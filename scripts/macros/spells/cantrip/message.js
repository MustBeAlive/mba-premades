export async function message({ speaker, actor, token, character, item, args, scope, workflow }) {
    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(workflow.token, { offset: offset[0], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .fadeIn(300)
        .fadeOut(500)
        .zIndex(1)
        .duration(5900)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .delay(600)
        .attachTo(workflow.token, { offset: offset[1], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .fadeIn(300)
        .fadeOut(500)
        .zIndex(1)
        .duration(5300)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .delay(1200)
        .attachTo(workflow.token, { offset: offset[2], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .fadeIn(300)
        .fadeOut(500)
        .zIndex(1)
        .duration(4700)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .delay(1800)
        .attachTo(workflow.token, { offset: offset[3], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .fadeIn(300)
        .fadeOut(500)
        .zIndex(1)
        .duration(4100)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .delay(2400)
        .attachTo(workflow.token, { offset: offset[4], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .fadeIn(300)
        .fadeOut(500)
        .zIndex(1)
        .duration(3500)
        .aboveLighting()

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.runes.orange")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeIn(300)
        .fadeOut(500)
        .duration(6000)
        .mask()

        .play()
}