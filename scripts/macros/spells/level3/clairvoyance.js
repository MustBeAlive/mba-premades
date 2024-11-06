import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

export async function clairvoyance({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["On current map", "map"], ["Somewhere else (ToM)", "theatre"]];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Clairvoyance", choices, "<b>Where would you like to create the sensor?</b>");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "map") {
        let sourceActor = game.actors.getName("MBA: Clairvoyance Sensor");
        if (!sourceActor) {
            ui.notifications.warn("Missing actor in the side panel! (MBA: Clairvoyance Sensor)");
            return;
        }
        let tokenName = `${workflow.token.document.name} Clairvoyance Sensor`;
        let updates = {
            'actor': {
                'name': tokenName,
                'prototypeToken': {
                    'detectionModes': workflow.token.document.detectionModes,
                    'disposition': workflow.token.document.disposition,
                    'name': tokenName,
                    'sight': workflow.token.document.sight
                }
            },
            'token': {
                'detectionModes': workflow.token.document.detectionModes,
                'disposition': workflow.token.document.disposition,
                'name': tokenName,
                'sight': workflow.token.document.sight,
            }
        };
        await mba.playerDialogMessage(game.user);
        await tashaSummon.spawn(sourceActor, updates, 600, workflow.item, 600, workflow.token, "future", {}, workflow.castData.castLevel);
        await mba.clearPlayerDialogMessage();
    }
    else if (selection === "theatre") {
        let effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees).</p>
                <p>The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with.</p>
                <p>When you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As your action, you can switch between seeing and hearing.</p>
                <p>A creature that can see the sensor (such as a creature benefiting from see invisibility or truesight) sees a luminous, intangible orb about the size of your fist.</p>
            `,
            'duration': {
                'seconds': 600
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 3,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jb2a.markers.light.complete.green02")
            .atLocation(workflow.token)
            .scaleToObject(3)
            .fadeIn(500)
            .duration(16000)
            .fadeOut(2000)

            .wait(1000)

            .thenDo(async () => {
                await mba.createEffect(workflow.actor, effectData);
            })

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.loop.green")
            .duration(16000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .filter("ColorMatrix", { hue: 30 })
            .belowTokens()
            .name('circle1')

            .effect()
            .file("jb2a.sleep.cloud.01.green")
            .duration(16000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .scale(0.7)
            .belowTokens()
            .zIndex(1)
            .opacity(0.5)
            .filter("ColorMatrix", { hue: 40 })
            .name('circle1.1')

            .effect()
            .file("jb2a.energy_beam.normal.greenyellow.03")
            .delay(1000)
            .duration(15000)
            .fadeIn(1000)
            .fadeOut(2000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .stretchTo(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .name("line1")

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.loop.green")
            .delay(1000)
            .duration(15000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .scale(0.2)
            .filter("ColorMatrix", { hue: 30 })
            .belowTokens()
            .name('circle2')

            .effect()
            .file("jb2a.sleep.cloud.01.green")
            .delay(1000)
            .duration(15000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .scale(0.7)
            .belowTokens()
            .zIndex(1)
            .opacity(0.5)
            .filter("ColorMatrix", { hue: 40 })
            .name('circle2.1')

            .effect()
            .file("jb2a.energy_beam.normal.greenyellow.03")
            .delay(2000)
            .duration(14000)
            .fadeIn(1000)
            .fadeOut(2000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .stretchTo(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .name("line2")

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.loop.green")
            .delay(2000)
            .duration(14000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .filter("ColorMatrix", { hue: 30 })
            .belowTokens()
            .name('circle3')

            .effect()
            .file("jb2a.sleep.cloud.01.green")
            .delay(2000)
            .duration(14000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .scale(0.7)
            .belowTokens()
            .zIndex(1)
            .opacity(0.5)
            .filter("ColorMatrix", { hue: 40 })
            .name('circle3.1')

            .effect()
            .file("jb2a.energy_beam.normal.greenyellow.03")
            .delay(3000)
            .duration(13000)
            .fadeIn(1000)
            .fadeOut(2000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .stretchTo(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .name("line3")

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.loop.green")
            .delay(3000)
            .duration(13000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .filter("ColorMatrix", { hue: 30 })
            .belowTokens()
            .name('circle4')

            .effect()
            .file("jb2a.sleep.cloud.01.green")
            .delay(3000)
            .duration(13000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .scale(0.7)
            .belowTokens()
            .zIndex(1)
            .opacity(0.5)
            .filter("ColorMatrix", { hue: 40 })
            .name('circle4.1')

            .effect()
            .file("jb2a.energy_beam.normal.greenyellow.03")
            .delay(4000)
            .duration(12000)
            .fadeIn(1000)
            .fadeOut(2000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .stretchTo(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .name("line4")

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.loop.green")
            .delay(4000)
            .duration(12000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .filter("ColorMatrix", { hue: 30 })
            .belowTokens()
            .name('circle5')

            .effect()
            .file("jb2a.sleep.cloud.01.green")
            .delay(4000)
            .duration(12000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .scale(0.7)
            .belowTokens()
            .zIndex(1)
            .opacity(0.5)
            .filter("ColorMatrix", { hue: 40 })
            .name('circle5.1')

            .effect()
            .file("jb2a.energy_beam.normal.greenyellow.03")
            .delay(5000)
            .duration(11000)
            .fadeIn(1000)
            .fadeOut(2000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .stretchTo(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .name("line5")

            .effect()
            .file("animated-spell-effects-cartoon.misc.all seeing eye")
            .delay(6000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(workflow.token)
            .scale(0.5)
            .filter("ColorMatrix", { hue: 20 })
            .duration(8667)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.green")
            .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle1outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.green")
            .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle2outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.green")
            .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle3outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.green")
            .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle4outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.green")
            .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle5outro')

            .play()
    }
}