export async function leomundTinyHut({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.evocation.complete.blue")
        .attachTo(template)
        .scaleToObject(1.1)
        .duration(4000)
        .fadeOut(1000)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.markers.bubble.loop.blue")
        .attachTo(template)
        .scaleToObject(1.1)
        .delay(2400)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0.1, 2500, { ease: "easeOutBack" })
        .opacity(0.3)
        .zIndex(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .persist()
        .name(`LeoTinyHut`)

        .effect()
        .file("modules/mba-premades/icons/spells/level3/tiny_hut/tiny_hut.webp")
        .attachTo(template)
        .scaleToObject(1.1)
        .delay(2400)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0.1, 2500, { ease: "easeOutBack" })
        .zIndex(2)
        .belowTokens()
        .persist()
        .name(`LeoTinyHut`)

        .effect()
        .file("jb2a.wall_of_force.sphere.blue")
        .attachTo(template)
        .scaleToObject(1.1)
        .delay(2400)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0.1, 2500, { ease: "easeOutBack" })
        .opacity(0.3)
        .zIndex(3)
        .playbackRate(0.8)
        .filter("Glow", { color: 0x000000, distance: 2.5, innerStrength: 1, outerStrength: 0 })
        .persist()
        .name(`LeoTinyHut`)

        .play()
}