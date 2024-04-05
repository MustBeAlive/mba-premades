// Animation by EskieMoh#2969
export async function revivify({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let isDead = await chrisPremades.helpers.findEffect(target.actor, 'Dead');
    if (!isDead) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    //what module tracks starttime?
    let timeDiff = game.time.worldTime - isDead.duration.startTime;
    if (timeDiff >= 60) {
        ui.notifications.info("Target is dead for at least 60 seconds. Sorry, but it's too late.");
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.tealyellow")
        .atLocation(target)
        .scaleToObject(1.5)
        .filter("ColorMatrix", { hue: 225 })
        .fadeOut(1000, { ease: "easeInExpo" })
        .belowTokens()
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .duration(1200)
        .attachTo(target, { bindAlpha: false })

        .effect()
        .from(target)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .fadeIn(100)
        .opacity(1)
        .fadeOut(5000)
        .duration(6000)
        .attachTo(target)

        .effect()
        .file("jb2a.fireflies.few.02.yellow")
        .atLocation(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .attachTo(target)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(target)
        .fadeIn(200)
        .opacity(0.25)
        .duration(10000)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .fadeIn(200, { ease: "easeInExpo" })
        .duration(10000)
        .opacity(0.25)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .thenDo(function () {
            chrisPremades.helpers.removeCondition(target.actor, 'Dead');
            chrisPremades.helpers.applyDamage([target], 1, 'healing');
        })

        .play()
}