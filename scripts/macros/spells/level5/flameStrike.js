import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    let fireDice = 4;
    let radiantDice = 4;
    if (ammount > 4) {
        let choices = [['Fire', 'fire'],['Radiant', 'radiant']];
        let selection = await mba.dialog('Choose which damage to scale:', choices);
        if (!selection) {
            ui.notifications.warn("Failed to choose damage to scale, try again!");
            return;
        }
        if (selection === "fire") fireDice = ammount;
        else if (selection === "radiant") radiantDice = ammount;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Flame Strike: Blast', false);
    if (!featureData) return;
    delete featureData._id;
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = mba.getSpellDC(originItem);
    featureData.system.damage.parts[0][0] = fireDice + 'd6[fire]';
    featureData.system.damage.parts[1][0] = radiantDice + 'd6[radiant]';
    setProperty(featureData, 'mba-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature);
}

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = fromUuidSync(workflow.templateUuid);
    new Sequence()

        .effect()
        .file("jb2a.sacred_flame.source.yellow")
        .atLocation(token)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(3)

        .effect()
        .file("jb2a.magic_signs.circle.02.evocation.loop.yellow")
        .atLocation(template)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .belowTokens()
        .scaleToObject(3)
        .duration(6000)
        .loopProperty("sprite", "rotation", { from: 0, to: 300, duration: 1000 })
        .scaleOut(0.5, 5000, { ease: "easeOutQuint", delay: -4000 })
        .zIndex(2)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .atLocation(template)
        .scaleToObject(2.5)
        .delay(3000)

        .effect()
        .file("jb2a.cast_shape.circle.01.yellow")
        .atLocation(template)
        .scaleToObject(2)
        .zIndex(1)
        .delay(2400)

        .effect()
        .file("jb2a.cast_generic.fire.01.orange.0")
        .atLocation(template)
        .scaleToObject(1)
        .delay(2600)

        .effect()
        .file("jb2a.fireball.explosion.orange")
        .atLocation(template)
        .scaleToObject(2)
        .zIndex(2)
        .delay(3000)
        .fadeOut(500)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Explosion/explosion-echo-5.mp3")
        .delay(4900)
        .fadeInAudio(500)
        .fadeOutAudio(500)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Radiant/radiant-build-up-1.mp3")
        .delay(1000)
        .fadeInAudio(500)
        .fadeOutAudio(500)

        .effect()
        .file("jb2a.ground_cracks.orange.01")
        .atLocation(template)
        .scaleToObject(1.5)
        .fadeIn(600, { ease: "easeInSine" })
        .belowTokens()
        .fadeOut(500)
        .delay(4000)
        .duration(8000)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.01")
        .atLocation(template)
        .scaleToObject(1.5)
        .fadeIn(600, { ease: "easeInSine" })
        .belowTokens()
        .zIndex(2)
        .fadeOut(500)
        .delay(4000)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: -2.5, y: -0.5 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2500)

        .effect()
        .atLocation(template, { offset: { x: -2.5, y: -0.0 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2500)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: -1.2, y: -2.6 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2600)

        .effect()
        .atLocation(template, { offset: { x: -1.2, y: -2.1 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2600)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: 1.2, y: -2.6 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2700)

        .effect()
        .atLocation(template, { offset: { x: 1.2, y: -2.1 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2700)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: 2.5, y: -0.5 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2800)

        .effect()
        .atLocation(template, { offset: { x: 2.5, y: 0.0 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2800)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: 1.2, y: 1.6 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2900)

        .effect()
        .atLocation(template, { offset: { x: 1.2, y: 2.0 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(2900)
        .duration(8000)

        .effect()
        .atLocation(template, { offset: { x: -1.2, y: 1.6 }, gridUnits: true })
        .file(`jb2a.flames.04.complete.orange`)
        .size(1.75, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(3200)

        .effect()
        .atLocation(template, { offset: { x: -1.2, y: 2.0 }, gridUnits: true })
        .file(`jb2a.ground_cracks.orange.01`)
        .size(1, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .belowTokens()
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .fadeOut(500)
        .delay(3000)
        .duration(8100)

        .play();
}

export let flameStrike = {
    'item': item,
    'cast': cast
}