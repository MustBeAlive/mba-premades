import {mba} from "../../../helperFunctions.js";

export async function purgeContamination({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let contamination = target.actor.effects.find(e => e.name.toLowerCase().includes("Contamination".toLowerCase()));
    if (!contamination) {
        ui.notifications.warn("Target has no levels of contamination!");
        return;
    }
    let level = +contamination.name.slice(-1);

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.purple")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.purplepink")
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1.5)
        .duration(1200)
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .from(target)
        .attachTo(target)
        .duration(6000)
        .fadeIn(100)
        .fadeOut(5000)
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })

        .effect()
        .file("jb2a.fireflies.few.02.purple")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.purple.01.03")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        
        .thenDo(async () => {
            await mba.removeCondition(target.actor, `Contamination ${level}`);
            await mba.addCondition(target.actor, `Exhaustion ${level}`);
        })

        .play()
}