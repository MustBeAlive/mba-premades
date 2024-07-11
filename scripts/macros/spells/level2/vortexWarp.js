import {mba} from "../../../helperFunctions.js";

export async function vortexWarp({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let maxRange = 90 + (30 * (workflow.castData.castLevel - 2));
    let icon = target.document.texture.src;
    let interval = target.document.width % 2 === 0 ? 1 : -1;
    await mba.playerDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, maxRange, icon, interval, target.document.width);
    await mba.clearPlayerDialogMessage();
    if (position.cancelled) return;

    await new Sequence()

        .effect()
        .from(target)
        .duration(1500)
        .scaleOut(0.01, 500, { ease: "easeInOutElastic" })
        .rotateIn(360, 300, { ease: "easeOutCubic", delay: 1000 })

        .animation()
        .on(target)
        .delay(100)
        .opacity(0)

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .atLocation(target)
        .size(1.35, { gridUnits: true })
        .delay(1000)
        .fadeOut(1000)
        .duration(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("jb2a.portals.horizontal.vortex.yellow")
        .atLocation(target)
        .scaleToObject(2)
        .duration(1500)
        .scaleIn(0, 600, { ease: "easeInOutCirc" })
        .scaleOut(0, 600, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(1)
        .zIndex(0)
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .atLocation(target)
        .scaleToObject(2.5)
        .fadeOut(1000)
        .scaleIn(0, 600, { ease: "easeInOutCirc" })
        .scaleOut(0, 600, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(0.2)
        .zIndex(0)
        .belowTokens()

        .effect()
        .file("jb2a.template_circle.vortex.intro.yellow")
        .atLocation(target)
        .scaleToObject(2)
        .scaleIn(0, 600, { ease: "easeInOutCirc" })
        .scaleOut(0, 600, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(1)
        .zIndex(1)
        .belowTokens()
        .waitUntilFinished()

        .animation()
        .on(target)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file("jb2a.portals.horizontal.vortex.purple")
        .atLocation(target)
        .scaleToObject(2)
        .duration(1500)
        .scaleIn(0, 600, { ease: "easeInOutCirc" })
        .scaleOut(0, 600, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(1)
        .zIndex(0)
        .belowTokens()

        .effect()
        .file("jb2a.template_circle.vortex.outro.purple")
        .atLocation(target)
        .scaleToObject(2)
        .scaleIn(0, 500, { ease: "easeInOutCirc" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(1)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .atLocation(target)
        .scaleToObject(2.5)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeInOutCirc" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .rotateIn(-360, 500, { ease: "easeOutCubic" })
        .rotateOut(360, 500, { ease: "easeOutCubic" })
        .opacity(0.2)
        .zIndex(0)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .atLocation(target)
        .size(1.35, { gridUnits: true })
        .delay(250)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .from(target)
        .atLocation(target)
        .duration(1500)
        .delay(250)
        .scaleIn({ x: 0.2, y: 0 }, 1000, { ease: "easeOutElastic" })
        .rotateIn(360, 500, { ease: "easeOutCubic" })
        .waitUntilFinished(-200)

        .animation()
        .on(target)
        .opacity(1)

        .play();
}