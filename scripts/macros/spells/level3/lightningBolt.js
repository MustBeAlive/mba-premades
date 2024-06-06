export async function lightningBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warn("Unable to find tempalte!");
        return;
    }

    new Sequence()

        .wait(200)

        .effect()
        .file("jb2a.breath_weapons.lightning.line.blue")
        .attachTo(token, { offset: { x: 0 }, gridUnits: true })
        .stretchTo(template, { onlyX: true })
        .spriteOffset({ x: token.document.width / 2.25 }, { gridUnits: true })

        .effect()
        .name("location")
        .file("jb2a.breath_weapons.lightning.line.blue")
        .attachTo(token, { offset: { x: 0 }, gridUnits: true })
        .stretchTo(template, { onlyX: true })
        .spriteOffset({ x: token.document.width / 2.25 }, { gridUnits: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 2, contrast: 1 })
        .duration(3350)
        .fadeOut(250)
        .fadeIn(10, { delay: 2700 })
        .aboveLighting()
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.05")
        .atLocation(token)
        .rotateTowards({ x: template.x, y: template.y })
        .rotate(90)
        .filter("ColorMatrix", { saturate: -1, brightness: 2, contrast: 1 })
        .spriteOffset({ x: -token.document.width - (0.25 * token.document.width), y: token.document.width / -4 }, { gridUnits: true })
        .scaleToObject(token.document.width * 2, { uniform: false })
        .aboveLighting()
        .playbackRate(1.6)
        .delay(2800)
        .zIndex(0.1)

        .effect()
        .file(canvas.scene.background.src)
        .filter("ColorMatrix", { brightness: 0.5 })
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .delay(1500)
        .duration(5500)
        .fadeIn(1500)
        .fadeOut(1500)
        .belowTokens()

        .effect()
        .from(token)
        .atLocation(token)
        .delay(2800)
        .duration(250)
        .fadeOut(200)
        .filter("ColorMatrix", { saturate: -1, brightness: 1, contrast: 1 })

        .canvasPan()
        .delay(2800)
        .shake({ duration: 250, strength: 35, rotation: false })

        .canvasPan()
        .delay(1500)
        .shake({ duration: 4500, strength: 1, rotation: false })

        .play()
}