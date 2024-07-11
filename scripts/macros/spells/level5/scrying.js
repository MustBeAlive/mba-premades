import {mba} from "../../../helperFunctions.js";

export async function scrying({ speaker, actor, token, character, item, args, scope, workflow }) {
    let conc = await mba.findEffect(workflow.actor, "Concentrating");
    let saveDC = await mba.getSpellDC(workflow.item);
    let choicesType = [["Creature", "creature"], ["Location", "location"]];
    await mba.playerDialogMessage();
    let selectionType = await mba.dialog("Scrying", choicesType, "<b>What are you scrying?</b>");
    await mba.clearPlayerDialogMessage();
    if (!selectionType) {
        if (conc) await mba.removeEffect(conc);
        return;
    }
    if (selectionType === "creature") {
        let choicesKnowledge = [
            ["Secondhand (you have heard of the target)", "secondhand"],
            ["Firsthand (you have met the target)", "firsthand"],
            ["Familiar (you know the target well)", "familiar"]
        ];
        await mba.playerDialogMessage();
        let selectionKnowledge = await mba.dialog("Scrying: Creature", choicesKnowledge, "<b>How well do you know the target?</b>");
        await mba.clearPlayerDialogMessage();
        if (!selectionKnowledge) {
            if (conc) await mba.removeEffect(conc);
            return;
        }
        if (selectionKnowledge === "secondhand") saveDC -= 5;
        else if (selectionKnowledge === "firsthand") saveDC += 0;
        else if (selectionKnowledge === "familiar") saveDC += 5;
        let choicesConnection = [
            ["Likeness or picture", "picture"],
            ["Possession or garment", "garment"],
            ["Body part, lock of hair, bit of nail, or the like", "part"]
        ];
        await mba.playerDialogMessage();
        let selectionConnection = await mba.dialog("Scrying: Creature", choicesConnection, "<b>Do you possess any physical connection to the target?</b>");
        await mba.clearPlayerDialogMessage();
        if (!selectionConnection) {
            if (conc) await mba.removeEffect(conc);
            return;
        }
        if (selectionConnection === "picture") saveDC += 2;
        else if (selectionConnection === "garment") saveDC += 5;
        else if (selectionConnection === "part") saveDC += 10;
    }

    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.blue02")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(500)
        .duration(16000)
        .fadeOut(2000)

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle1')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle1.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .name("line1")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle2')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle2.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .name("line2")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle3')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle3.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .name("line3")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle4')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle4.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .stretchTo(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .name("line4")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle5')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.7)
        .belowTokens()
        .zIndex(1)
        .opacity(0.5)
        .name('circle5.1')

        .effect()
        .file("jb2a.energy_beam.normal.blue.01")
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
        .filter("ColorMatrix", { hue: 95 })
        .duration(8667)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(workflow.token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle5outro')

        .play()

    if (selectionType === "creature") {
        let choicesGM = [
            ["Target Saved", "save"],
            ["Target Failed", "fail"],
            ["Don't contest (fail voluntarily)", "fail"]
        ];
        await mba.gmDialogMessage();
        let selectionGM = await mba.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `
            <p><b>${workflow.token.document.name}</b> attempts to Scry ${selectionType}.</p>
            <p>Save DC: <b>Wisdom, ${saveDC}</b></p>
        `);
        await mba.clearGMDialogMessage();
        if (!selectionGM || selectionGM === "save") {
            ui.notifications.info(`Target succesfully saved! (Save DC: ${saveDC})`);
            if (conc) await mba.removeEffect(conc);
            return;
        }
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}