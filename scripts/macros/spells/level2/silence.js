// Animation by EskieMoh#2969
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    await new Sequence()

        .effect()
        .file("jb2a.moonbeam.01.outro.yellow")
        .atLocation(template)
        .size(0.75, { gridUnits: true })
        .startTime(500)
        .playbackRate(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .delay(750)
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .atLocation(template)
        .size(5, { gridUnits: true })
        .opacity(0.5)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .delay(750)
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .atLocation(template)
        .size(9, { gridUnits: true })
        .opacity(0.75)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .atLocation(template)
        .size(2, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })
        .belowTokens()
        .waitUntilFinished(-1000)

        .thenDo(function () {
            if (!game.modules.get("ActiveAuras")?.active) {
                ui.notifications.warn("ActiveAuras is not enabled!");
                return;
            }
            AAhelpers.applyTemplate(args);
        })

        .effect()
        .file("jb2a.markers.bubble.complete.blue")
        .atLocation(template)
        .size(9, { gridUnits: true })
        .opacity(0.2)
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .belowTokens()
        .persist()
        .name(`Silence`)

        .effect()
        .file("jb2a.wall_of_force.sphere.grey")
        .atLocation(template)
        .size(9, { gridUnits: true })
        .opacity(0.2)
        .fadeIn(500)
        .fadeOut(2000, { delay: 5000 })
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .playbackRate(0.8)
        .filter("Glow", { color: 0x000000, distance: 2.5, innerStrength: 3, outerStrength: 0 })
        .filter("ColorMatrix", { saturate: -1 })
        .persist()
        .name(`Silence`)

        .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.illusion")
        .atLocation(template)
        .size(2, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .fadeOut(2000)
        .playbackRate(0.8)
        .opacity(0.35)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .persist()
        .name(`Silence`)

        .play()
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Silence" })
}

export let silence = {
    'item': item,
    'del': del
}