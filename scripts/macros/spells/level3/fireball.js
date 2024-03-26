// Animation by EskieMoh#2969
export async function fireball({ speaker, actor, token, character, item, args, scope, workflow }) {
    //Toggle Scorched Earth
    let scorchedEarth = true
    //Persist ground effects?
    let persistEffect = true
    //Select fireball cast circle color
    let fireballBeam = "jb2a.fireball.beam.orange";
    let fireballCircle = "jb2a.magic_signs.circle.02.evocation.loop.red";
    let fireballParticles02 = "jb2a.particles.outward.greenyellow.01.02";
    let fireballParticles03 = "jb2a.particles.outward.greenyellow.01.03";
    let fireballParticles04 = "jb2a.particles.outward.greenyellow.01.04";
    let fireballExplosion = "jb2a.fireball.explosion.orange";
    let fireballCracks = "jb2a.ground_cracks.orange.01";
    let fireballCastSound = "modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-blast-binaural-1.mp3"; // The DND5e Animations module includes this sound if installed
    let fireballBlastSound = "modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-flamethrower-2.mp3"; // The DND5e Animations module includes this sound if installed

    const templateData = fromUuidSync(workflow.templateUuid);

    new Sequence()

        .effect()
        .file(fireballBeam)
        .attachTo(token)
        .stretchTo(templateData)

        .effect()
        .attachTo(token)
        .file(fireballCircle)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .attachTo(token)
        .file(fireballCircle)
        .scaleToObject(1.25)
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
        .file(fireballParticles02)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file(fireballParticles04)
        .atLocation(token)
        .fadeIn(500)
        .fadeOut(500)
        .anchor({ x: 0.5 })
        .scaleToObject(2)
        .duration(5000)
        .rotateTowards(templateData, { cacheLocation: true })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000 })
        .scaleOut(0, 5000, { ease: "easeOutQuint", delay: -3000 })
        .zIndex(1)

        .effect()
        .file(fireballParticles03)
        .atLocation(token)
        .anchor({ x: 0.4 })
        .scaleToObject(.5)
        .animateProperty("sprite", "position.x", { from: 0, to: -1000, duration: 15000 })
        .rotateTowards(templateData, { cacheLocation: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .duration(6000)
        .playbackRate(2)
        .fadeOut(2000)
        .delay(2000)
        .zIndex(2)

        .sound()
        .file(fireballCastSound)
        .fadeInAudio(500)
        .fadeOutAudio(500)
        .waitUntilFinished()

        .effect()
        .file(fireballExplosion)
        .attachTo(templateData)
        .size(10.5, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(2)

        .sound()
        .file(fireballBlastSound)
        .fadeInAudio(500)
        .fadeOutAudio(500)

        .effect()
        .file(fireballCracks)
        .attachTo(templateData)
        .size(6.5, { gridUnits: true })
        .randomRotation()
        .fadeOut(2000)
        .duration(5000)
        .belowTokens()
        .delay(2300)
        .persist(persistEffect)
        .playIf(() => {
            return scorchedEarth == true;
        })
        .zIndex(0.1)

        .play();
}