import {mba} from "../../../helperFunctions.js";

export async function eldritchMaster({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Eldritch Master");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Eldritch Master");
        return;
    }
    let pactCurrent = workflow.actor.system.spells.pact.value;
    let pactMax = workflow.actor.system.spells.pact.max;
    if (pactCurrent >= pactMax) {
        ui.notifications.info("You don't have any expended pact slots!");
        await feature.update({ "system.uses.value": 1 });
        return;
    }
    let path = `system.spells.pact.value`;

    new Sequence()

        .effect()
        .file("jb2a.dodecahedron.rune.below.blueyellow")
        .attachTo(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { hue: 210 })

        .effect()
        .file("jb2a.particle_burst.01.rune.bluepurple")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .delay(2000)
        .fadeIn(1000)
        .playbackRate(0.9)

        .wait(1500)

        .thenDo(async () => {
            await workflow.actor.update({ [path]: pactMax });
        })

        .play()
}