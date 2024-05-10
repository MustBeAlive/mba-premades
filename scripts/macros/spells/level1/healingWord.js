import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.info('Healing Word fails!');
        return false;
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let word = [];
    let wordInput = await warpgate.menu({
        inputs: [{
            label: `What do you say?`,
            type: 'text',
            options: ``
        }],
        buttons: [{
            label: 'Cast!',
            value: 1
        }]
    },
        { title: 'Healing Word' }
    );

    word.push(wordInput.inputs);

    const style = {
        "fill": "#ffffff",
        "fontFamily": "Helvetica",
        "fontSize": 40,
        "strokeThickness": 0,
        fontWeight: "bold",
    }

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.healing word.green")
        .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .zIndex(1)
        .scale(0.25 * target.data.width)
        .scaleIn(0, 500, { ease: "easeOutBack" })

        .effect()
        .file("jb2a.particles.outward.orange.02.04")
        .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .zIndex(1)
        .scale(0.25 * target.data.width)
        .duration(600)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .zIndex(0)

        .effect()
        .file("jb2a.particles.outward.orange.02.03")
        .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .scale(0.25 * target.data.width)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 1000, gridUnits: true, delay: 500 })
        .animateProperty("sprite", "scale.x", { from: 0, to: 0.15, duration: 1000, delay: 500 })
        .animateProperty("sprite", "scale.y", { from: 0, to: 0.15, duration: 1000, delay: 500 })
        .zIndex(1.1)

        .effect()
        .text(`${word}`, style)
        .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
        .duration(2000)
        .fadeOut(1000)
        .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 1000, gridUnits: true, delay: 500 })
        .animateProperty("sprite", "scale.x", { from: 0, to: -0.5, duration: 1000, delay: 500 })
        .animateProperty("sprite", "scale.y", { from: 0, to: -0.5, duration: 1000, delay: 500 })
        .rotateIn(-10, 1000, { ease: "easeOutElastic" })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .filter("Glow", { color: 0x006102 })
        .zIndex(1)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.healing_generic.200px.green")
        .atLocation(target)
        .scaleToObject(1.25)
        .filter("ColorMatrix", { hue: -35 })
        .zIndex(2)

        .effect()
        .from(target)
        .opacity(0.5)
        .attachTo(target)
        .duration(1000)
        .fadeIn(500)
        .fadeOut(500, { ease: "easeInSine" })
        .scaleToObject(target.document.texture.scaleX)
        .filter("Glow", { color: 0x006102, distance: 20 })
        .filter("ColorMatrix", { brightness: 1.5 })
        .tint(0x006102)

        .play()
}

export let healingWord = {
    'cast': cast,
    'item': item
}