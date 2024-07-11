async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let targets = Array.from(workflow.targets);

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.cast_generic.ice.01.blue.0")
        .attachTo(token)
        .scaleToObject(3.5)
        .fadeIn(1500)

        .effect()
        .file("jb2a.dancing_light.blueteal")
        .delay(2000)
        .atLocation(token)
        .rotateTowards(template)
        .filter("ColorMatrix", { hue: 10, saturate: -0.5, brightness: 1.5 })
        .size(0.9 * token.data.width, { gridUnits: true })
        .spriteScale({ x: 0.5, y: 1.0 })
        .spriteOffset({ x: 0.25 }, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(1000)
        .fadeOut(1000)
        .duration(5000)

        .effect()
        .file("jb2a.cone_of_cold.blue")
        .delay(3000)
        .attachTo(token)
        .stretchTo(template)

        .play()


    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.impact.ground_crack.frost.01.blue")
            .delay(4700)
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(500)
            .mask()

            .effect()
            .file("jb2a.impact_themed.ice_shard.01.blue")
            .delay(5000)
            .attachTo(target)
            .scaleToObject(1.8)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.02")
            .delay(3700)
            .attachTo(target)
            .belowTokens()
            .scaleToObject(target.document.texture.scaleX * 1.55)
            .opacity(0.45)
            .scaleIn(0, 6000, { ease: "easeOutExpo" })
            .fadeIn(1000, { delay: 1000, ease: "easeOutExpo" })

            .play()
    }
}

async function death({ speaker, actor, token, character, item, args, scope, workflow }) {
    for (let target of Array.from(workflow.targets)) {
        if (target.actor.system.attributes.hp.value > 0) continue;
        new Sequence()

            .effect()
            .file("jb2a.impact.ground_crack.frost.01.blue")
            .attachTo(target)
            .scaleToObject(1.3)
            .fadeIn(2000)
            .endTime(3400)
            .fadeOut(1000)
            .mask()
            .persist()
            .noLoop()

            .play()
    }
}

export let coneOfCold = {
    'item': item,
    'death': death
}