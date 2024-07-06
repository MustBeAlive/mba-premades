export async function aganazzarScorcher({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.static.orange.005")
        .scaleToObject(2)
        .attachTo(workflow.token)
        .belowTokens()
        .atLocation(workflow.token)
        .fadeIn(200)
        .fadeOut(550)

        .wait(450)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(workflow.token, { offset: { x: 0, y: -30 } })
        .scaleToObject(2.1)
        .belowTokens()
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(workflow.token, { offset: { x: 0, y: 30 } })
        .mirrorY()
        .scaleToObject(2.1)
        .belowTokens()
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .atLocation(workflow.token)
        .rotate(-110)
        .scaleToObject(2)
        .waitUntilFinished(-850)

        .effect()
        .file("animated-spell-effects-cartoon.fire.32")
        .atLocation(workflow.token)
        .spriteOffset({ x: 30, y: 10 })
        .scaleToObject(2.1)
        .mirrorX()
        .rotate(-90)
        .waitUntilFinished(-1150)

        .effect()
        .file("animated-spell-effects-cartoon.fire.03")
        .atLocation(workflow.token)
        .scaleToObject(2.1)
        .rotate(90)
        .spriteOffset({ x: 10, y: -15 })
        .mirrorX()
        .waitUntilFinished(-700)

        .effect()
        .file("animated-spell-effects-cartoon.fire.13")
        .atLocation(workflow.token)
        .scaleToObject(0.5)
        .opacity(0.9)
        .spriteOffset({ x: -10, y: -10 })
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.level 02.aganazzar")
        .attachTo(workflow.token)
        .stretchTo(template)
        .repeats(3, 1000)

        .play()
}