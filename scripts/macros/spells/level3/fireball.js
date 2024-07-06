export async function fireball({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.fireball.beam.orange")
        .attachTo(workflow.token)
        .stretchTo(template)

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.04")
        .atLocation(workflow.token)
        .rotateTowards(template, { cacheLocation: true })
        .scaleToObject(2)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000 })
        .scaleOut(0, 5000, { ease: "easeOutQuint", delay: -3000 })
        .anchor({ x: 0.5 })
        .zIndex(1)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-blast-binaural-1.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(500)
        .volume(0.5)
        .waitUntilFinished()

        .effect()
        .file("jb2a.fireball.explosion.orange")
        .attachTo(template)
        .size(10.5, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(2)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-flamethrower-2.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(1000)
        .volume(0.2)

        .effect()
        .file("jb2a.ground_cracks.orange.01")
        .attachTo(template)
        .size(7.5, { gridUnits: true })
        .delay(1400)
        .duration(5000)
        .fadeOut(3000)
        .zIndex(0.1)
        .randomRotation()
        .belowTokens()
        .persist()

        .play();
}