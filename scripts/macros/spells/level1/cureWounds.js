async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Cure Wounds fails!');
        return false;
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .delay(600)
        .file("jb2a.healing_generic.200px.blue")
        .scaleToObject(1.75)
        .atLocation(target)

        .effect()
        .file("jb2a.bless.200px.intro.blue")
        .scaleToObject(1.5)
        .playbackRate(1.25)
        .attachTo(target)
        .belowTokens()

        .effect()
        .delay(600)
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
}

export let cureWounds = {
    'cast': cast,
    'item': item
}