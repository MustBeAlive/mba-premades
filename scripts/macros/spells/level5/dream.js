import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.pink")
        .atLocation(token)
        .scaleToObject(3)
        .fadeIn(500)
        .duration(16000)
        .fadeOut(2000)

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
        .duration(16000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1')

        .effect()
        .file("jb2a.sleep.cloud.01.pink")
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
        .filter("ColorMatrix", { hue: 100 })
        .opacity(0.8)
        .name("line1")

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
        .delay(1000)
        .duration(15000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2')

        .effect()
        .file("jb2a.sleep.cloud.01.pink")
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
        .filter("ColorMatrix", { hue: 100 })
        .opacity(0.8)
        .name("line2")

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
        .delay(2000)
        .duration(14000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3')

        .effect()
        .file("jb2a.sleep.cloud.01.pink")
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
        .filter("ColorMatrix", { hue: 100 })
        .opacity(0.8)
        .name("line3")

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
        .delay(3000)
        .duration(13000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4')

        .effect()
        .file("jb2a.sleep.cloud.01.pink")
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
        .filter("ColorMatrix", { hue: 100 })
        .opacity(0.8)
        .name("line4")

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
        .delay(4000)
        .duration(12000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle5')

        .effect()
        .file("jb2a.sleep.cloud.01.pink")
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
        .filter("ColorMatrix", { hue: 100 })
        .opacity(0.8)
        .name("line5")

        .effect()
        .file("jb2a.magic_signs.rune.illusion.complete.pink")
        .delay(6000)
        .fadeIn(1000)
        .fadeOut(2000)
        .atLocation(token)
        .scale(0.5)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
        .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle1outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
        .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle2outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
        .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle3outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
        .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle4outro')

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
        .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
        .scale(0.2)
        .belowTokens()
        .zIndex(2)
        .name('circle5outro')

        .play()

    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 28800
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
    const saveDC = await mba.getSpellDC(workflow.item);
    let choicesGM1 = [["Target is Awake", "awake"], ["Target is Asleep", "asleep"], ["Target does not have a need to sleep (such as elf)", "no"]];
    let selectionGM1 = await mba.remoteDialog(workflow.item.name, choicesGM1, game.users.activeGM.id, `
        <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dream</b></p>
    `);
    if (!selectionGM1) return;
    if (selectionGM1 === "no") {
        ui.notifications.warn("Dream is inapplicable (target does not have a need to sleep)");
        return;
    }
    else if (selectionGM1 === "awake") {
        let choicesAwake = [["Yes, wait for the target to fall asleep", "yes"], ["No, cancel casting Dream", "no"]];
        let selectionAwake = await mba.dialog("Target is awake. Would you like to wait?", choicesAwake);
        if (!selectionAwake || selectionAwake === "no") return;
        if (selectionAwake === "yes") {
            let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Dream: Retry', false);
            if (!featureData) {
                ui.notifications.warn("Unable to find item in Compendium! (Dream: Retry)");
                return;
            }
            delete featureData._id;
            featureData.system.save.dc = saveDC;
            async function effectMacroDel() {
                await warpgate.revert(token.document, "Dream");
            }
            let effectData = {
                'name': workflow.item.name,
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'duration': {
                    'seconds': 28800
                },
                'flags': {
                    'effectmacro': {
                        'onDelete': {
                            'script': mba.functionToString(effectMacroDel)
                        }
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 5,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            let updates = {
                'embedded': {
                    'Item': {
                        [featureData.name]: featureData
                    },
                    'ActiveEffect': {
                        [effectData.name]: effectData
                    }
                }
            };
            let options = {
                'permanent': false,
                'name': 'Dream',
                'description': 'Dream'
            };
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            return;
        }
    }
    else if (selectionGM1 === "asleep") {
        let choicesAsleep = [["Friendly (dialog)", "dream"], ["Nightmare (save)", "nightmare"]];
        let selectionAsleep = await mba.dialog("Choose dream type:", choicesAsleep);
        if (!selectionAsleep) return;
        if (selectionAsleep === "dream") await mba.createEffect(workflow.actor, effectData);
        else if (selectionAsleep === "nightmare") {
            let disadvantage = false;
            let choicesNightmare = [["Body part, lock of hair, clipping from a nail or similar", "yes"], ["Nothing", "no"]];
            let selectionNightmare = await mba.dialog("Do you have anything of the above?", choicesNightmare);
            if (!selectionNightmare) return;
            if (selectionNightmare === "yes") disadvantage = true;
            let choicesGM2 = [
                ["Target Saved", "save"],
                ["Target Failed", "fail"]
            ];
            let selectionGM2 = await mba.remoteDialog(workflow.item.name, choicesGM2, game.users.activeGM.id, `
                <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dream</b></p>
                <p>Save DC: <b>Wisdom: ${saveDC}</b></p>
                <p>Disadvantage: <b>${disadvantage}</b></p>
            `);
            if (!selectionGM2) return;
            if (selectionGM2 === "save") {
                ui.notifications.info(`Target succesfully saved! (Save DC: ${saveDC})`);
                return;
            }
            else if (selectionGM2 === "fail") {
                await mba.createEffect(workflow.actor, effectData);
                let damageRoll = await new Roll("3d6[psychic]").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
                damageRoll.toMessage({
                    rollMode: 'roll',
                    speaker: { actor: workflow.actor },
                    flavor: `<b>Dream: Nightmare</b>`
                });
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `
                        <p>Echoes of the phantasmal monstrosity spawn a nightmare that lasts the duration of the target's sleep and prevents the target from gaining any benefit from that rest.</p>
                        <p>In addition, when the target wakes up, it takes ${damageRoll.total} psychic damage.</p>
                    `,
                    speaker: { actor: null, alias: "GM Helper" }
                });
            }
        }
    }
}

async function wait({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Dream");
    if (!effect) return;
    const effectData = {
        'name': effect.name,
        'icon': effect.icon,
        'origin': effect.flags['midi-qol']?.castData?.itemUuid,
        'duration': {
            'seconds': effect.duration.remaining
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: effect.flags['midi-qol']?.castData?.baseLevel,
                    castLevel: effect.flags['midi-qol']?.castData?.castLevel,
                    itemUuid: effect.flags['midi-qol']?.castData?.itemUuid
                }
            }
        }
    };
    let choicesGM1 = [["Target is still Awake", "awake"], ["Target fell Asleep", "asleep"]];
    let selectionGM1 = await mba.remoteDialog(workflow.item.name, choicesGM1, game.users.activeGM.id, `
        <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dream</b></p>
    `);
    if (!selectionGM1) return;
    if (selectionGM1 === "awake") {
        ui.notifications.info("Target is still awake!");
        return;
    }
    else if (selectionGM1 === "asleep") {
        let choicesAsleep = [["Friendly (dialog)", "dream"], ["Nightmare (save)", "nightmare"]];
        let selectionAsleep = await mba.dialog("Choose dream type:", choicesAsleep);
        if (!selectionAsleep) return;
        if (selectionAsleep === "dream") {
            await mba.removeEffect(effect);
            await warpgate.wait(100);
            await mba.createEffect(workflow.actor, effectData);
        }
        else if (selectionAsleep === "nightmare") {
            let disadvantage = false;
            let choicesNightmare = [["Body part, lock of hair, clipping from a nail or similar", "yes"], ["Nothing", "no"]];
            let selectionNightmare = await mba.dialog("Do you have anything of the above?", choicesNightmare);
            if (!selectionNightmare) return;
            if (selectionNightmare === "yes") disadvantage = true;
            let saveDC = await mba.getSpellDC(workflow.item);
            let choicesGM2 = [
                ["Target Saved", "save"],
                ["Target Failed", "fail"]
            ];
            let selectionGM2 = await mba.remoteDialog(workflow.item.name, choicesGM2, game.users.activeGM.id, `
                <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dream</b></p>
                <p>Save DC: <b>Wisdom: ${saveDC}</b></p>
                <p>Disadvantage: <b>${disadvantage}</b></p>
            `);
            if (!selectionGM2) return;
            if (selectionGM2 === "save") {
                ui.notifications.info(`Target succesfully saved! (Save DC: ${saveDC})`);
                await mba.removeEffect(effect);
                return;
            }
            else if (selectionGM2 === "fail") {
                let damageRoll = await new Roll("3d6[psychic]").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
                damageRoll.toMessage({
                    rollMode: 'roll',
                    speaker: { actor: workflow.actor },
                    flavor: `<b>Dream: Nightmare</b>`
                });
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `
                        <p>Echoes of the phantasmal monstrosity spawn a nightmare that lasts the duration of the target's sleep and prevents the target from gaining any benefit from that rest.</p>
                        <p>In addition, when the target wakes up, it takes ${damageRoll.total} psychic damage.</p>
                    `,
                    speaker: { actor: null, alias: "GM Helper" }
                });
                await mba.removeEffect(effect);
                await warpgate.wait(100);
                await mba.createEffect(workflow.actor, effectData);
            }
        }

        new Sequence()

            .effect()
            .file("jb2a.markers.light.complete.pink")
            .atLocation(token)
            .scaleToObject(3)
            .fadeIn(500)
            .duration(16000)
            .fadeOut(2000)

            .wait(1000)

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
            .duration(16000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle1')

            .effect()
            .file("jb2a.sleep.cloud.01.pink")
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
            .filter("ColorMatrix", { hue: 100 })
            .opacity(0.8)
            .name("line1")

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
            .delay(1000)
            .duration(15000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle2')

            .effect()
            .file("jb2a.sleep.cloud.01.pink")
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
            .filter("ColorMatrix", { hue: 100 })
            .opacity(0.8)
            .name("line2")

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
            .delay(2000)
            .duration(14000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle3')

            .effect()
            .file("jb2a.sleep.cloud.01.pink")
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
            .filter("ColorMatrix", { hue: 100 })
            .opacity(0.8)
            .name("line3")

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
            .delay(3000)
            .duration(13000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle4')

            .effect()
            .file("jb2a.sleep.cloud.01.pink")
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
            .filter("ColorMatrix", { hue: 100 })
            .opacity(0.8)
            .name("line4")

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.loop.pink")
            .delay(4000)
            .duration(12000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle5')

            .effect()
            .file("jb2a.sleep.cloud.01.pink")
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
            .filter("ColorMatrix", { hue: 100 })
            .opacity(0.8)
            .name("line5")

            .effect()
            .file("jb2a.magic_signs.rune.illusion.complete.pink")
            .delay(6000)
            .fadeIn(1000)
            .fadeOut(2000)
            .atLocation(token)
            .scale(0.5)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
            .atLocation(token, { offset: { x: -1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle1outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
            .atLocation(token, { offset: { x: 0, y: -1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle2outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
            .atLocation(token, { offset: { x: 1, y: 1.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle3outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
            .atLocation(token, { offset: { x: -1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle4outro')

            .effect()
            .file("jb2a.magic_signs.circle.02.illusion.outro.pink")
            .atLocation(token, { offset: { x: 1.5, y: -0.5 }, gridUnits: true })
            .scale(0.2)
            .belowTokens()
            .zIndex(2)
            .name('circle5outro')

            .play()
    }
}

export let dream = {
    "item": item,
    "wait": wait
}