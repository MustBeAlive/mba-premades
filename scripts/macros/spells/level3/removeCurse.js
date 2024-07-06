import {mba} from "../../../helperFunctions.js";

export async function removeCurse({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.isCurse === true);
    if (!effects.length) {
        await mba.gmDialogMessage();
        let choicesGM = [
            ["Yes, break attunement", true],
            ["No, target is not cursed", false]
        ];
        let selectionGM = await mba.remoteDialog("Remove Curse", choicesGM, game.users.activeGM.id, `Is <u>${target.document.name}</u> attuned to a cursed magical item?`);
        await mba.clearGMDialogMessage();
        if (!selectionGM) {
            ui.notifications.info("Remove Curse fails: target is not affected by any curse!");
            return;
        }
        else {
            ui.notifications.info(`You succesfully broke ${target.document.name} attuenement to a cursed magic item!`);
            new Sequence()

                .effect()
                .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
                .atLocation(target)
                .scaleToObject(1)

                .effect()
                .file("jb2a.misty_step.02.blue")
                .atLocation(target)
                .scaleToObject(1)
                .scaleOut(1, 3500, { ease: "easeOutCubic" })

                .wait(1400)

                .effect()
                .file("jb2a.healing_generic.burst.bluewhite")
                .atLocation(target)
                .attachTo(target, { bindAlpha: false })
                .scaleToObject(1.5)
                .duration(1200)
                .fadeOut(1000, { ease: "easeInExpo" })
                .scaleIn(0, 500, { ease: "easeOutCubic" })
                .belowTokens()

                .effect()
                .from(target)
                .atLocation(target)
                .attachTo(target)
                .duration(6000)
                .fadeIn(100)
                .fadeOut(5000)
                .filter("ColorMatrix", { saturate: -1, brightness: 10 })
                .filter("Blur", { blurX: 5, blurY: 10 })
                .opacity(1)

                .effect()
                .file("jb2a.fireflies.few.02.blue")
                .atLocation(target)
                .scaleToObject(2)
                .duration(10000)
                .fadeIn(1000)
                .fadeOut(500)
                .attachTo(target)

                .effect()
                .file("jb2a.extras.tmfx.outflow.circle.02")
                .atLocation(target)
                .attachTo(target)
                .scaleToObject(2)
                .duration(10000)
                .fadeOut(500)
                .fadeIn(1000)
                .opacity(0.25)
                .belowTokens()

                .effect()
                .file("jb2a.particles.outward.blue.01.03")
                .atLocation(target)
                .attachTo(target)
                .scaleToObject(2)
                .duration(10000)
                .fadeOut(500)
                .fadeIn(1000)
                .opacity(0.25)
                .belowTokens()
                .filter("ColorMatrix", { saturate: -1, brightness: 2 })

                .play()
            return;
        }
    }

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.blue")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.bluewhite")
        .atLocation(target)
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1.5)
        .duration(1200)
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()

        .thenDo(async () => {
            for (let curseEffect of effects) await mba.removeEffect(curseEffect);
        })

        .effect()
        .from(target)
        .atLocation(target)
        .attachTo(target)
        .duration(6000)
        .fadeIn(100)
        .fadeOut(5000)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(1)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .atLocation(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .attachTo(target)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(target)
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeOut(500)
        .fadeIn(1000)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .atLocation(target)
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeOut(500)
        .fadeIn(1000)
        .opacity(0.25)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .play()
}