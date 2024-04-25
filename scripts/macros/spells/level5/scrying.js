export async function scrying({ speaker, actor, token, character, item, args, scope, workflow }) {
    let conc = await chrisPremades.helpers.findEffect(workflow.actor, "Concentrating");
    let saveDC = await chrisPremades.helpers.getSpellDC(workflow.item);
    let choicesType = [["Creature", "creature"], ["Location", "location"]];
    let selectionType = await chrisPremades.helpers.dialog("What are you scrying?", choicesType);
    if (!selectionType) {
        if (conc) await chrisPremades.helpers.removeEffect(conc);
        return;
    }
    if (selectionType === "creature") {
        let choicesKnowledge = [
            ["Secondhand (you have heard of the target)", "secondhand"],
            ["Firsthand (you have met the target)", "firsthand"],
            ["Familiar (you know the target well)", "familiar"]
        ];
        let selectionKnowledge = await chrisPremades.helpers.dialog("How well do you know the target?", choicesKnowledge);
        if (!selectionKnowledge) {
            if (conc) await chrisPremades.helpers.removeEffect(conc);
            return;
        }
        if (selectionKnowledge === "secondhand") saveDC -= 5;
        if (selectionKnowledge === "firsthand") saveDC += 0;
        if (selectionKnowledge === "familiar") saveDC += 5;
        let choicesConnection = [
            ["Likeness or picture", "picture"],
            ["Possession or garment", "garment"],
            ["Body part, lock of hair, bit of nail, or the like", "part"]
        ];
        let selectionConnection = await chrisPremades.helpers.dialog("Do you possess any physical connection to the target?", choicesConnection);
        if (!selectionConnection) {
            if (conc) await chrisPremades.helpers.removeEffect(conc);
            return;
        }
        if (selectionConnection === "picture") saveDC += 2;
        if (selectionConnection === "garment") saveDC += 5;
        if (selectionConnection === "part") saveDC += 10;
    }

    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.blue02")
        .atLocation(token)
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
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle1')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
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
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .stretchTo(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .name("line1")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle2')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
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
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .stretchTo(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .name("line2")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle3')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
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
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .stretchTo(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .name("line3")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle4')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
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
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .stretchTo(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .name("line4")

        .effect()
        .file("jb2a.magic_signs.circle.01.divination")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .name('circle5')

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
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
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .stretchTo(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .name("line5")

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .delay(6000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token)
        .scale(0.5)
        .filter("ColorMatrix", { hue: 95 })
        .duration(8667)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.outro.blue")
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
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
        let selectionGM = await chrisPremades.helpers.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `
            <p><b>${workflow.token.document.name}</b> attempts to Scry ${selectionType}.</p>
            <p>Save DC: <b>Wisdom, ${saveDC}</b></p>
        `);
        if (!selectionGM || selectionGM === "save") {
            ui.notifications.info(`Target succesfully saved! (Save DC: ${saveDC})`);
            if (conc) await chrisPremades.helpers.removeEffect(conc);
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

    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}