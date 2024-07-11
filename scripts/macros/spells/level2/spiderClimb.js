import {mba} from "../../../helperFunctions.js";

export async function spiderClimb({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: "SpiderLeg" })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You gain the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free.</p>
            <p>You also gain a climbing speed equal to your walking speed.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.movement.climb',
                'mode': 4,
                'value': "@attributes.movement.walk",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    let hue = -50;
    let legSpeed1 = Math.random() * (600) + 150;
    let legSpeed2 = Math.random() * (600) + 150;
    let legSpeed3 = Math.random() * (600) + 150;
    let legSpeed4 = Math.random() * (600) + 150;
    let legSpeed5 = Math.random() * (800) + 100;
    let legSpeed6 = Math.random() * (800) + 100;
    let legSpeed7 = Math.random() * (800) + 100;
    let legSpeed8 = Math.random() * (800) + 100;
    let sizeMod = target.w / canvas.grid.size;
    let delay1 = Math.random() * (500 - 0) + 0;
    let delay2 = Math.random() * (500 - 0) + 0;
    let delay3 = Math.random() * (500 - 0) + 0;
    let delay4 = Math.random() * (500 - 0) + 0;
    let delay5 = Math.random() * (500 - 0) + 0;
    let delay6 = Math.random() * (500 - 0) + 0;
    let delay7 = Math.random() * (500 - 0) + 0;
    let delay8 = Math.random() * (500 - 0) + 0;

    await new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.liquid.splash.green")
        .atLocation(target)
        .scaleToObject(1.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .rotate(125)
        .zIndex(2)

        .wait(250)

        //top left leg
        .effect()
        .name("SpiderLeg")
        .delay(delay1)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "top-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX - 0.75, y: 0.15 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: 0.025, duration: (1500 - legSpeed1) * 2, pingPong: true, delay: 500 - legSpeed1, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed1, pingPong: true, delay: 500 - legSpeed1, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 25, duration: 1500 - legSpeed1, delay: 500 - legSpeed1, ease: "linear", pingPong: true })
        .persist()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1.05)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay1)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "top-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX + 0.05, y: -0.05 })
        .loopProperty("spriteContainer", "position.x", { from: -0.05 * sizeMod, to: 0.15 * sizeMod, duration: (1500 - legSpeed1) * 2, pingPong: true, delay: 500 - legSpeed1, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [0.09 * sizeMod, 0.15 * sizeMod, 0.15 * sizeMod, 0.09 * sizeMod], duration: 1500 - legSpeed1, pingPong: true, delay: 500 - legSpeed1, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed1, pingPong: true, delay: 500 - legSpeed1, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -45, duration: (1500 - legSpeed1) * 2, delay: 500 - legSpeed1, ease: "linear", pingPong: true })
        .persist()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1)
        .fadeOut(1000)

        //botttom left leg
        .effect()
        .name("SpiderLeg")
        .delay(delay2)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "bottom-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX - 0.75, y: 1.46 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: 0.025, duration: (1500 - legSpeed2) * 2, pingPong: true, delay: 500 - legSpeed2, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed2, pingPong: true, delay: 500 - legSpeed2, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 25, duration: 1500 - legSpeed2, delay: 500 - legSpeed2, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.25)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay2)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "bottom-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX + 0.05, y: 1.26 })
        .loopProperty("spriteContainer", "position.x", { from: -0.05 * sizeMod, to: 0.15 * sizeMod, duration: (1500 - legSpeed2) * 2, pingPong: true, delay: 500 - legSpeed2, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [0.09 * sizeMod, 0.15 * sizeMod, 0.15 * sizeMod, 0.09 * sizeMod], duration: 1500 - legSpeed2, pingPong: true, delay: 500 - legSpeed2, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed2, pingPong: true, delay: 500 - legSpeed2, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -45, duration: (1500 - legSpeed2) * 2, delay: 500 - legSpeed2, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.2)
        .fadeOut(1000)

        //top right leg
        .effect()
        .name("SpiderLeg")
        .delay(delay3)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "top-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 1.75, y: 0.15 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: -0.025, duration: (1500 - legSpeed3) * 2, pingPong: true, delay: 500 - legSpeed3, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed3, pingPong: true, delay: 500 - legSpeed3, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -25, duration: 1500 - legSpeed3, delay: 500 - legSpeed3, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .mirrorX()
        .zIndex(1.05)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay3)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "top-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 0.95, y: -0.05 })
        .loopProperty("spriteContainer", "position.x", { from: 0.05 * sizeMod, to: -0.15 * sizeMod, duration: (1500 - legSpeed3) * 2, pingPong: true, delay: 500 - legSpeed3, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [-0.09 * sizeMod, -0.15 * sizeMod, -0.15 * sizeMod, -0.09 * sizeMod], duration: 1500 - legSpeed3, pingPong: true, delay: 500 - legSpeed3, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed3, pingPong: true, delay: 500 - legSpeed3, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 45, duration: (1500 - legSpeed3) * 2, delay: 500 - legSpeed3, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .mirrorX()
        .zIndex(1)
        .fadeOut(1000)

        //bottom right leg
        .effect()
        .name("SpiderLeg")
        .delay(delay4)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "bottom-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 1.75, y: 1.46 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: -0.025, duration: (1500 - legSpeed4) * 2, pingPong: true, delay: 500 - legSpeed4, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed4, pingPong: true, delay: 500 - legSpeed4, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -25, duration: 1500 - legSpeed4, delay: 500 - legSpeed4, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .mirrorX()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.25)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay4)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "bottom-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 0.95, y: 1.26 })
        .loopProperty("spriteContainer", "position.x", { from: 0.05 * sizeMod, to: -0.15 * sizeMod, duration: (1500 - legSpeed4) * 2, pingPong: true, delay: 500 - legSpeed4, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [-0.09 * sizeMod, -0.15 * sizeMod, -0.15 * sizeMod, -0.09 * sizeMod], duration: 1500 - legSpeed4, pingPong: true, delay: 500 - legSpeed4, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed4, pingPong: true, delay: 500 - legSpeed4, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 45, duration: (1500 - legSpeed4) * 2, delay: 500 - legSpeed4, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .mirrorX()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.2)

        .wait(500)

        //additional top left leg
        .effect()
        .name("SpiderLeg")
        .delay(delay5)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "top-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX - 0.75, y: -0.15 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: 0.025, duration: (1500 - legSpeed5) * 2, pingPong: true, delay: 500 - legSpeed5, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed5, pingPong: true, delay: 500 - legSpeed5, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 25, duration: 1500 - legSpeed5, delay: 500 - legSpeed5, ease: "linear", pingPong: true })
        .persist()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1.15)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay5)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "top-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX + 0.05, y: -0.35 })
        .loopProperty("spriteContainer", "position.x", { from: -0.05 * sizeMod, to: 0.15 * sizeMod, duration: (1500 - legSpeed5) * 2, pingPong: true, delay: 500 - legSpeed5, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [0.09 * sizeMod, 0.15 * sizeMod, 0.15 * sizeMod, 0.09 * sizeMod], duration: 1500 - legSpeed5, pingPong: true, delay: 500 - legSpeed5, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed5, pingPong: true, delay: 500 - legSpeed5, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -45, duration: (1500 - legSpeed5) * 2, delay: 500 - legSpeed5, ease: "linear", pingPong: true })
        .persist()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1.1)
        .fadeOut(1000)

        //additional botttom left leg
        .effect()
        .name("SpiderLeg")
        .delay(delay6)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "bottom-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX - 0.75, y: 1.16 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: 0.025, duration: (1500 - legSpeed6) * 2, pingPong: true, delay: 500 - legSpeed6, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed6, pingPong: true, delay: 500 - legSpeed6, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 25, duration: 1500 - legSpeed6, delay: 500 - legSpeed6, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.35)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay6)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: target.document.texture.scaleX, y: 0.25 }, align: "bottom-left", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: target.document.texture.scaleX + 0.05, y: 0.96 })
        .loopProperty("spriteContainer", "position.x", { from: -0.05 * sizeMod, to: 0.15 * sizeMod, duration: (1500 - legSpeed6) * 2, pingPong: true, delay: 500 - legSpeed6, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [0.09 * sizeMod, 0.15 * sizeMod, 0.15 * sizeMod, 0.09 * sizeMod], duration: 1500 - legSpeed6, pingPong: true, delay: 500 - legSpeed6, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed6, pingPong: true, delay: 500 - legSpeed6, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -45, duration: (1500 - legSpeed6) * 2, delay: 500 - legSpeed6, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.3)
        .fadeOut(1000)

        //additional top right leg
        .effect()
        .name("SpiderLeg")
        .delay(delay7)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "top-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 1.75, y: -0.15 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: -0.025, duration: (1500 - legSpeed7) * 2, pingPong: true, delay: 500 - legSpeed7, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed7, pingPong: true, delay: 500 - legSpeed7, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -25, duration: 1500 - legSpeed7, delay: 500 - legSpeed7, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .mirrorX()
        .zIndex(1.15)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay7)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "top-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 0.95, y: -0.35 })
        .loopProperty("spriteContainer", "position.x", { from: 0.05 * sizeMod, to: -0.15 * sizeMod, duration: (1500 - legSpeed7) * 2, pingPong: true, delay: 500 - legSpeed7, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [-0.09 * sizeMod, -0.15 * sizeMod, -0.15 * sizeMod, -0.09 * sizeMod], duration: 1500 - legSpeed7, pingPong: true, delay: 500 - legSpeed7, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed7, pingPong: true, delay: 500 - legSpeed7, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 45, duration: (1500 - legSpeed7) * 2, delay: 500 - legSpeed7, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .mirrorX()
        .zIndex(1.1)
        .fadeOut(1000)

        //additional bottom right leg
        .effect()
        .name("SpiderLeg")
        .delay(delay8)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg1.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "bottom-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 1.75, y: 1.16 })
        .loopProperty("spriteContainer", "position.x", { from: 0, to: -0.025, duration: (1500 - legSpeed8) * 2, pingPong: true, delay: 500 - legSpeed8, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.1, duration: 1500 - legSpeed8, pingPong: true, delay: 500 - legSpeed8, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: -25, duration: 1500 - legSpeed8, delay: 500 - legSpeed8, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .mirrorX()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.35)
        .fadeOut(1000)

        .effect()
        .name("SpiderLeg")
        .delay(delay8)
        .file("modules/mba-premades/icons/spells/level2/spider_climb/spiderleg2.webp")
        .atLocation(target)
        .attachTo(target, { offset: { x: -target.document.texture.scaleX, y: 0.25 }, align: "bottom-right", bindAlpha: false, bindVisibility: false, followRotation: false })
        .scaleToObject(target.document.texture.scaleX * 0.55)
        .anchor({ x: -target.document.texture.scaleX + 0.95, y: 0.96 })
        .loopProperty("spriteContainer", "position.x", { from: 0.05 * sizeMod, to: -0.15 * sizeMod, duration: (1500 - legSpeed8) * 2, pingPong: true, delay: 500 - legSpeed8, gridUnits: true })
        .loopProperty("sprite", "position.x", { values: [-0.09 * sizeMod, -0.15 * sizeMod, -0.15 * sizeMod, -0.09 * sizeMod], duration: 1500 - legSpeed8, pingPong: true, delay: 500 - legSpeed8, gridUnits: true })
        .loopProperty("sprite", "position.y", { from: 0.05, to: -0.15, duration: 1500 - legSpeed8, pingPong: true, delay: 500 - legSpeed8, gridUnits: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 45, duration: (1500 - legSpeed8) * 2, delay: 500 - legSpeed8, ease: "linear", pingPong: true })
        .persist()
        .belowTokens()
        .mirrorX()
        .filter("ColorMatrix", { hue: hue })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .zIndex(1.3)
        .fadeOut(1000)

        .play()

    await mba.createEffect(target.actor, effectData);
}