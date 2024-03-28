async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targetIds = [];
    for (let i of workflow.targets) {
        let type = chrisPremades.helpers.raceOrType(i.actor);
        if (type === 'undead' || type === 'construct') {
            ChatMessage.create({ flavor: 'Mass Healing Word fails on ' + i.name + '!', speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) });
            continue;
        }
        targetIds.push(i.document.id);
    }
    await game.user.updateTokenTargets(targetIds);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
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
        { title: 'Mass Healing Word' }
    );

    word.push(wordInput.inputs);

    const style = {
        "fill": "#ffffff",
        "fontFamily": "Helvetica",
        "fontSize": 48,
        "strokeThickness": 0,
        fontWeight: "bold",

    }

    game.user.targets.forEach(target => {

        new Sequence()

            .effect()
            .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
            .file("animated-spell-effects-cartoon.level 01.healing word.green")
            .fadeOut(250)
            .zIndex(1)
            .scale(0.25 * target.data.width)
            .scaleIn(0, 500, { ease: "easeOutBack" })
            .zIndex(0)

            .effect()
            .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
            .file("jb2a.particles.outward.orange.02.04")
            .fadeOut(250)
            .zIndex(1)
            .scale(0.25 * target.data.width)
            .duration(600)
            .scaleIn(0, 500, { ease: "easeOutBack" })
            .zIndex(0)

            .effect()
            .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
            .file("jb2a.particles.outward.orange.02.03")
            .fadeOut(250)
            .zIndex(1)
            .scale(0.25 * target.data.width)
            .scaleIn(0, 500, { ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 1000, gridUnits: true, delay: 500 })
            .animateProperty("sprite", "scale.x", { from: 0, to: 0.15, duration: 1000, delay: 500 })
            .animateProperty("sprite", "scale.y", { from: 0, to: 0.15, duration: 1000, delay: 500 })
            .zIndex(1.1)

            .effect()
            .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
            .text(`${word}`, style)
            .duration(2000)
            .fadeOut(1000)
            .zIndex(1)
            .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 1000, gridUnits: true, delay: 500 })
            .animateProperty("sprite", "scale.x", { from: 0, to: -0.5, duration: 1000, delay: 500 })
            .animateProperty("sprite", "scale.y", { from: 0, to: -0.5, duration: 1000, delay: 500 })
            .rotateIn(-10, 1000, { ease: "easeOutElastic" })
            .scaleIn(0, 500, { ease: "easeOutElastic" })
            .filter("Glow", { color: 0x006102 })
            .zIndex(1)
            .waitUntilFinished(-1000)

            .effect()
            .atLocation(target)
            .file("jb2a.healing_generic.200px.green")
            .scaleToObject(1.25)
            .filter("ColorMatrix", { hue: -35 })
            .zIndex(2)

            .effect()
            .from(target)
            .opacity(0.5)
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX)
            .filter("Glow", { color: 0x006102, distance: 20 })
            .duration(1000)
            .fadeIn(500)
            .fadeOut(500, { ease: "easeInSine" })
            .filter("ColorMatrix", { brightness: 1.5 })
            .tint(0x006102)

            .play();
    });
}

export let massHealingWord = {
    'cast': cast,
    'item': item
}