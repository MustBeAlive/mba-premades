//Animation by tranquilite#8382
export async function fireBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.orange.005")
            .scaleToObject(2)
            .attachTo(token)
            .belowTokens()
            .atLocation(token)
            .fadeIn(200)
            .fadeOut(550)

            .wait(450)

            .effect()
            .file("animated-spell-effects-cartoon.fire.25")
            .atLocation(token, { offset: { x: 0, y: -30 } })
            .scaleToObject(2.1)
            .belowTokens()
            .waitUntilFinished(-650)

            .effect()
            .file("animated-spell-effects-cartoon.fire.25")
            .atLocation(token, { offset: { x: 0, y: 30 } })
            .mirrorY()
            .scaleToObject(2.1)
            .belowTokens()
            .waitUntilFinished(-650)

            .effect()
            .file("animated-spell-effects-cartoon.fire.19")
            .atLocation(token)
            .rotate(-110)
            .scaleToObject(2)
            .waitUntilFinished(-850)


            .effect()
            .file("animated-spell-effects-cartoon.fire.32")
            .atLocation(token)
            .spriteOffset({ x: 30, y: 10 })
            .scaleToObject(2.1)
            .mirrorX()
            .rotate(-90)
            .waitUntilFinished(-1150)

            .effect()
            .file("animated-spell-effects-cartoon.fire.03")
            .atLocation(token)
            .scaleToObject(2.1)
            .rotate(90)
            .spriteOffset({ x: 10, y: -15 })
            .mirrorX()
            .waitUntilFinished(-700)


            .effect()
            .file("animated-spell-effects-cartoon.fire.13")
            .atLocation(token)
            .scaleToObject(0.5)
            .opacity(0.9)
            .spriteOffset({ x: -10, y: -10 })
            .waitUntilFinished(-1000)

            .effect()
            .file("animated-spell-effects-cartoon.fire.20")
            .atLocation(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .waitUntilFinished(-1000)

            .play();

        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.static.orange.005")
        .scaleToObject(2)
        .attachTo(token)
        .belowTokens()
        .atLocation(token)
        .fadeIn(200)
        .fadeOut(550)

        .wait(450)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(token, { offset: { x: 0, y: -30 } })
        .scaleToObject(2.1)
        .belowTokens()
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(token, { offset: { x: 0, y: 30 } })
        .mirrorY()
        .scaleToObject(2.1)
        .belowTokens()
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .atLocation(token)
        .rotate(-110)
        .scaleToObject(2)
        .waitUntilFinished(-850)


        .effect()
        .file("animated-spell-effects-cartoon.fire.32")
        .atLocation(token)
        .spriteOffset({ x: 30, y: 10 })
        .scaleToObject(2.1)
        .mirrorX()
        .rotate(-90)
        .waitUntilFinished(-1150)

        .effect()
        .file("animated-spell-effects-cartoon.fire.03")
        .atLocation(token)
        .scaleToObject(2.1)
        .rotate(90)
        .spriteOffset({ x: 10, y: -15 })
        .mirrorX()
        .waitUntilFinished(-700)


        .effect()
        .file("animated-spell-effects-cartoon.fire.13")
        .atLocation(token)
        .scaleToObject(0.5)
        .opacity(0.9)
        .spriteOffset({ x: -10, y: -10 })
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.20")
        .atLocation(token)
        .stretchTo(target)
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.35")
        .atLocation(target)
        .scaleToObject(1.3)
        .randomRotation()
        .fadeIn(200)
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.wall")
        .atLocation(target)
        .spriteOffset({ x: 0, y: 30 })
        .fadeIn(200)
        .scaleToObject(1.5)
        .mask()
        .fadeOut(2000)
        .duration(5000)

        .play()
}