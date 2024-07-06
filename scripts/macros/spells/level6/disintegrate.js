import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} DT1`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} DT1`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} DT2`)

        .effect()
        .file("jb2a.impact.010.orange")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .zIndex(1)

        .wait(50)

        .effect()
        .file("jb2a.twinkling_stars.points04.orange")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.25, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 4042, ease: "easeOutSine" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .rotate(0)
        .zIndex(1)
        .persist()
        .name(`${workflow.token.document.name} DT1`)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.03.normal")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.35)
        .duration(4042)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.275, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .spriteOffset({ x: -0.175 }, { gridUnits: true })
        .rotate(0)
        .opacity(0.8)
        .zIndex(0)
        .tint("#89eb34")
        .persist()
        .name(`${workflow.token.document.name} DT1`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let offsetX = 0;
    let offsetY = 0;
    if (!workflow.failedSaves.size) {
        offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
    }
    let centerX = target.x + canvas.grid.size / 2
    let centerY = target.y + canvas.grid.size / 2
    /*let updates = {
        'token': {
            'hidden': true
        }
    };
    let options = {
        'permanent': false,
        'name': 'Disintegration',
        'description': 'Disintegration'
    };*/

    await new Sequence()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} DT1` })
        })

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .atLocation(workflow.token)
        .size(1.75, { gridUnits: true })
        .delay(500)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .atLocation(workflow.token)
        .size(1.75, { gridUnits: true })
        .delay(500)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .mirrorX()

        .effect()
        .file("jb2a.disintegrate.green")
        .atLocation(workflow.token)
        .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .zIndex(1)
        .playbackRate(0.9)
        .repeats(2, 1000)

        .play()

    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} DT2` })
    if (target.actor.system.attributes.hp.value > 0) return;
    if (mba.findEffect(target.actor, "Unconscious")) await mba.removeCondition(target.actor, 'Unconscious');
    await mba.addCondition(target.actor, 'Dead', true);

    new Sequence()

        .animation()
        .on(target)
        .delay(1)
        .opacity(0)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .atLocation(target, { offset: { y: -0.25 }, gridUnits: true })
        .delay(500)
        .fadeIn(1000)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .duration(10000)
        .fadeOut(2000)
        .scaleToObject(0.8)
        .filter("ColorMatrix", { brightness: 0 })
        .zIndex(1)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.4,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.1, y: -canvas.grid.size * 0.4 },
        })
        .duration(4000)
        .fadeOut(2000)
        .name(`1.2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: -canvas.grid.size * 0.4, y: canvas.grid.size * 0.3 },
        })
        .duration(6000)
        .fadeOut(2000)
        .name(`2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.5, y: canvas.grid.size * 0.4 },
        })
        .duration(8000)
        .fadeOut(2000)
        .name(`3`)
        .waitUntilFinished()

        /*
        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })*/

        .play()
}

export let disintegrate = {
    'cast': cast,
    'item': item
}