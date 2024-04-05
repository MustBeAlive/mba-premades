async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let validTargets = [];
    for (let i of workflow.targets) {
        if (i.actor.system.details.type.value != 'undead' && i.actor.system.details.type.value != 'construct') validTargets.push(i.id);
    }
    if (!validTargets.length) return;
    await chrisPremades.helpers.updateTargets(validTargets);
    await warpgate.wait(100);
    let ammount = 6;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(game.user.targets), false, 'multiple', undefined, false, 'Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let finalTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(finalTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    let targets = Array.from(game.user.targets);

    await new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.loop.red`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.loop.red`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .delay(1000)
        .atLocation(template)
        .file("jb2a.healing_generic.burst.bluewhite")
        .belowTokens()
        .scaleToObject(1.15)

        .play()

    targets.forEach(target => {

        new Sequence()

            .effect()
            .delay(500)
            .file("jb2a.healing_generic.200px.blue")
            .scaleToObject(1.75)
            .atLocation(target)

            .effect()
            .file("jb2a.bless.200px.intro.blue")
            .scaleToObject(1.75)
            .playbackRate(1.25)
            .attachTo(target)
            .belowTokens()

            .effect()
            .delay(500)
            .file(`jb2a.particles.outward.blue.02.03`)
            .attachTo(target, { followRotation: false })
            .scaleToObject(1.1)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.5, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.5, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .zIndex(0.2)

            .play();
    })
}

export let massCureWounds = {
    'cast': cast,
    'item': item
}