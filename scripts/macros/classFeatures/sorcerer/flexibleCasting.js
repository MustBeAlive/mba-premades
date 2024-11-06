import {mba} from "../../../helperFunctions.js";

export async function flexibleCasting({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }

    // Check for available options
    let pointsToSlots = false;
    let slotToPoints = false;
    let points = pointsItem.system.uses.value;
    let slots = Object.values(workflow.actor.system.spells).filter(i => i.slotAvailable === true);
    if (points >= 2) pointsToSlots = true;
    if (slots.length) slotToPoints = true;
    let choicesType = [];
    let selection;
    if (pointsToSlots === true) choicesType.push(["Sorcery Points into Spell Slots", "pts"]);
    if (slotToPoints === true) choicesType.push(["Spell Slots into Sorcery Points", "stp"]);

    //No options available
    if (!choicesType.length) {
        ui.notifications.info("You can neither create slots, nor sorcery points!");
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * token.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens()
        .zIndex(0)
        .persist()
        .name(`${workflow.token.document.name} Flexible Casting`)

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * token.document.texture.scaleX)
        .duration(1200)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .zIndex(1)
        .persist()
        .name(`${workflow.token.document.name} Flexible Casting`)

        .play();

    // Skip dialog if only 1 option is available
    if (choicesType.length === 1) selection = choicesType[0][1];

    // Dialog promt if both options available
    if (!selection) {
        choicesType.push(["Cancel", false]);
        await mba.playerDialogMessage(game.user);
        selection = await mba.dialog("Flexible Casting: Type", choicesType, `<b>Choose type of magic transformation:</b>`);
        await mba.clearPlayerDialogMessage();
        if (!selection) {
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            return;
        }
    }

    // POINTS TO SLOTS
    if (selection === "pts") {
        let pointsToSlotsOptions = [[`<b>Level 1</b> (2 points)`, 1, "modules/mba-premades/icons/class/sorcerer/create_sorcery_points_1.webp"]];
        if (points >= 3 && workflow.actor.system.spells.spell2.max != 0) pointsToSlotsOptions.push(["<b>Level 2</b> (3 points)", 2, "modules/mba-premades/icons/class/sorcerer/create_sorcery_points_2.webp"]);
        if (points >= 5 && workflow.actor.system.spells.spell3.max != 0) pointsToSlotsOptions.push(["<b>Level 3</b> (5 points)", 3, "modules/mba-premades/icons/class/sorcerer/create_sorcery_points_3.webp"])
        if (points >= 6 && workflow.actor.system.spells.spell4.max != 0) pointsToSlotsOptions.push(["<b>Level 4</b> (6 points)", 4, "modules/mba-premades/icons/class/sorcerer/create_sorcery_points_4.webp"]);
        if (points >= 7 && workflow.actor.system.spells.spell5.max != 0) pointsToSlotsOptions.push(["<b>Level 5</b> (7 points)", 5, "modules/mba-premades/icons/class/sorcerer/create_sorcery_points_5.webp"]);
        pointsToSlotsOptions.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
        await mba.playerDialogMessage(game.user);
        let slotLevel = await mba.selectImage("Flexible Casting: Points to Slots", pointsToSlotsOptions, `<b>Choose spell slot level to recover:</b>`, "value");
        await mba.clearPlayerDialogMessage();
        if (!slotLevel) {
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            return;
        }

        // Points evaluation
        let cost = slotLevel + 2;
        if (slotLevel < 3) cost = slotLevel + 1;
        points -= cost;

        // Slot Evaluation
        let path = `system.spells.spell${slotLevel}.value`;
        let newValue = foundry.utils.getProperty(workflow.actor, path) + 1;
        if (isNaN(newValue)) {
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            return;
        }

        // Final Update

        new Sequence()

            .effect()
            .file("jb2a.particle_burst.01.rune.yellow")
            .attachTo(token)
            .scaleToObject(2 * token.document.texture.scaleX)
            .fadeIn(1000)
            .playbackRate(0.9)

            .wait(750)

            .thenDo(async () => {
                await workflow.actor.update({ [path]: newValue });
                await pointsItem.update({ "system.uses.value": points });
                await Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            })

            .play()
    }


    // SLOTS TO POINTS
    else if (selection === "stp") {
        let slotsToPointsOptions = [];
        let i = 1;
        for (let slot of slots) {
            if (slot.value >= 1) slotsToPointsOptions.push([`<b>Level: ${i}</b> (Current: <b>${slot.value}/${slot.max}</b>)`, i, `modules/mba-premades/icons/class/sorcerer/spell_slot_restoration_level_${i}.webp`]);
            i += 1;
        }
        slotsToPointsOptions.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
        await mba.playerDialogMessage(game.user);
        let pointsAmmount = await mba.selectImage("Flexible Casting: Slots to Poins", slotsToPointsOptions, `<b>Choose spell slot level:</b>`, "value");
        await mba.clearPlayerDialogMessage();
        if (!pointsAmmount) {
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            return;
        }

        // Points evaluation
        points += pointsAmmount;

        // Slot Evaluation
        let path = `system.spells.spell${pointsAmmount}.value`;
        let newValue = foundry.utils.getProperty(workflow.actor, path) - 1;
        if (isNaN(newValue)) {
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            return;
        }

        // Final Update
        new Sequence()

            .effect()
            .file("jb2a.particle_burst.01.rune.yellow")
            .attachTo(token)
            .scaleToObject(2 * token.document.texture.scaleX)
            .fadeIn(1000)
            .playbackRate(0.9)

            .wait(750)

            .thenDo(async () => {
                await workflow.actor.update({ [path]: newValue });
                await pointsItem.update({ "system.uses.value": points });
                await Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Flexible Casting`, 'object': workflow.token });
            })

            .play()
    }
}