import {mba} from "../../../helperFunctions.js";

export async function rabbitHop({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.actor.system.attributes.movement.walk === 0) {
        ui.notifications.warn("Your speed is zero!");
        return;
    }
    let distance = workflow.actor.system.attributes.prof * 5;
    await mba.playerDialogMessage(game.user);
    let position = await mba.aimCrosshair(workflow.token, distance, workflow.item.img, 2, workflow.token.document.width);
    await mba.clearPlayerDialogMessage();
    if (position.cancelled) return;

    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.ring.02.white")
        .atLocation(workflow.token)
        .scaleToObject(.75)
        .opacity(.5)
        .belowTokens()

        .animation()
        .on(workflow.token)
        .opacity(0)

        .effect()
        .file("jb2a.wind_stream.white")
        .anchor({ x: 0.5, y: .5 })
        .atLocation(workflow.token)
        .duration(1000)
        .opacity(2)
        .scale(workflow.token.w / canvas.grid.size * 0.025)
        .moveTowards(position)
        .mirrorX()
        .zIndex(1)

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .opacity(1)
        .duration(1000)
        .anchor({ x: 0.5, y: 1.5 })
        .loopProperty("sprite", "position.y", { values: [50, 0, 50], duration: 500 })
        .loopProperty("sprite", "scale.x", { from: 1, to: 1.5, duration: 500, pingPong: true, delay: 0 })
        .loopProperty("sprite", "scale.y", { from: 1, to: 1.5, duration: 500, pingPong: true, delay: 0 })
        .moveTowards(position, { rotate: false })
        .zIndex(2)

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .opacity(0.5)
        .scale(0.9)
        .belowTokens()
        .duration(1000)
        .anchor({ x: 0.5, y: 0.5 })
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .moveTowards(position, { rotate: false })
        .zIndex(2)
        .waitUntilFinished()

        .animation()
        .on(workflow.token)
        .opacity(1)
        .teleportTo(position)
        .snapToGrid()
        .waitUntilFinished()

        .effect()
        .file("jb2a.smoke.puff.ring.02.white")
        .atLocation(workflow.token)
        .scaleToObject(2.5)
        .opacity(.5)
        .belowTokens()

        .play();
}