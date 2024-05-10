import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    new Sequence()
        .thenDo(function () {
            targets.forEach(target => {
                new Sequence()

                    .effect()
                    .from(target)
                    .atLocation(target)
                    .scaleToObject(target.document.texture.scaleX)
                    .fadeOut(100)
                    .persist()
                    .name(`${target.document.name} Arms of Hadar`)

                    .wait(150)

                    .animation()
                    .on(target)
                    .opacity(0)

                    .play()
            })
        })

        .effect()
        .file(`jb2a.ward.rune.dark_purple.01`)
        .atLocation(token)
        .scaleToObject(1.85)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .file("jb2a.arms_of_hadar.dark_purple")
        .atLocation(token)
        .randomRotation()
        .scaleIn(0, 1500, { ease: "easeOutCirc" })
        .fadeOut(500)
        .belowTokens()
        .scaleToObject(1.75)
        .zIndex(1)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .atLocation(token)
        .filter("ColorMatrix", { brightness: -1 })
        .randomRotation()
        .size(1.5, { gridUnits: true })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(0.1)

        .effect()
        .file("jb2a.particles.outward.purple.01.02")
        .atLocation(token)
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .filter("ColorMatrix", { brightness: -1 })
        .zIndex(1)

        .wait(1000)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.inpulse.01.fast")
        .atLocation(token)
        .scaleToObject(1.5)
        .filter("ColorMatrix", { brightness: -1 })
        .waitUntilFinished()

        .effect()
        .file("jb2a.impact.ground_crack.dark_red.02")
        .atLocation(token)
        .delay(150)
        .belowTokens()
        .size(3.5, { gridUnits: true })
        .filter("ColorMatrix", { hue: -100, brightness: -1 })

        .effect()
        .file("jb2a.impact.004.dark_purple")
        .atLocation(token)
        .delay(150)
        .scaleToObject(4)
        .filter("ColorMatrix", { hue: -100, brightness: -1 })
        .scaleIn(0, 500, { ease: "easeOutCirc" })

        .effect()
        .file("jb2a.arms_of_hadar.dark_purple")
        .atLocation(token)
        .delay(150)
        .randomRotation()
        .scaleIn(0, 750, { ease: "easeOutCirc" })
        .animateProperty("sprite", "width", { from: 5.5, to: 0, duration: 1500, delay: 1000, gridUnits: true, ease: "easeOutCirc" })
        .animateProperty("sprite", "height", { from: 5.5, to: 0, duration: 1500, delay: 1000, gridUnits: true, ease: "easeOutCirc" })
        .fadeOut(500)
        .size(6, { gridUnits: true })
        .belowTokens()
        .zIndex(1)
        .duration(2000)

        .thenDo(function () {
            targets.forEach(target => {
                let tokenCenterX = token.x + canvas.grid.size * target.document.width / 2
                let tokenCenterY = token.y + canvas.grid.size * target.document.width / 2
                let targetCenterX = target.x + canvas.grid.size * target.document.width / 2
                let targetCenterY = target.y + canvas.grid.size * target.document.width / 2
                let newX = targetCenterX - (canvas.grid.size / 2.5 * Math.sign(tokenCenterX - targetCenterX))
                let newY = targetCenterY - (canvas.grid.size / 2.5 * Math.sign(tokenCenterY - targetCenterY))

                new Sequence()
                    .effect()
                    .file("animated-spell-effects-cartoon.energy.tentacles")
                    .atLocation(target)
                    .moveTowards({ x: newX, y: newY }, { rotate: true, ease: "easeOutBack" })
                    .scaleToObject(1)
                    .filter("ColorMatrix", { hue: -100, brightness: 0 })
                    .opacity(0.75)

                    .thenDo(function () {
                        Sequencer.EffectManager.endEffects({ name: `${target.document.name} Arms of Hadar` })
                    })

                    .effect()
                    .from(target)
                    .atLocation(target)
                    .scaleToObject(target.document.width * target.document.texture.scaleX)
                    .moveTowards({ x: newX, y: newY }, { rotate: false, ease: "easeOutBack" })
                    .duration(750)
                    .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 175, pingPong: true, gridUnits: true })
                    .opacity(0.15)
                    .zIndex(0.1)

                    .effect()
                    .from(target)
                    .atLocation(target)
                    .scaleToObject(target.document.width * target.document.texture.scaleX)
                    .moveTowards({ x: newX, y: newY }, { rotate: false, ease: "easeOutBack" })
                    .duration(750)
                    .waitUntilFinished(-50)

                    .effect()
                    .from(target)
                    .atLocation({ x: newX, y: newY })
                    .scaleToObject(target.document.texture.scaleX)
                    .moveTowards(target, { rotate: false, ease: "easeOutBack" })
                    .duration(1500)
                    .waitUntilFinished(-50)

                    .animation()
                    .on(target)
                    .opacity(1)

                    .play()
            })
        })
        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.findEffect(target.actor, 'Reaction')) continue;
        await mba.addCondition(target.actor, 'Reaction');
    }
}

export let armsOfHadar = {
    'cast': cast,
    'item': item
}