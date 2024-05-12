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

    // Skip dialog if only 1 option is available
    if (choicesType.length === 1) selection = choicesType[0][1];

    // Dialog promt if both options available
    if (!selection) {
        choicesType.push(["Cancel", "cancel"]);
        selection = await mba.dialog("Flexible Casting: Type", choicesType, `<b>Choose type of magic transformation:</b>`);
        if (!selection || selection === "cancel") return;
    }

    // POINTS TO SLOTS
    if (selection === "pts") {
        let pointsToSlotsOptions = [[`<b>Level 1</b> (2 points)`, 1]];
        if (points >= 3 && workflow.actor.system.spells.spell2.max != 0) pointsToSlotsOptions.push(["<b>Level 2</b> (3 points)", 2]);
        if (points >= 5 && workflow.actor.system.spells.spell3.max != 0) pointsToSlotsOptions.push(["<b>Level 3</b> (5 points)", 3])
        if (points >= 6 && workflow.actor.system.spells.spell4.max != 0) pointsToSlotsOptions.push(["<b>Level 4</b> (6 points)", 4]);
        if (points >= 7 && workflow.actor.system.spells.spell5.max != 0) pointsToSlotsOptions.push(["<b>Level 5</b> (7 points)", 5]);
        pointsToSlotsOptions.push(["Cancel", "cancel"]);
        let slotLevel = await mba.dialog("FC: Points to Slots", pointsToSlotsOptions, `<b>Choose slot level:</b>`);
        if (!slotLevel || slotLevel === "cancel") return;

        // Points evaluation
        let cost;
        if (slotLevel < 3) cost = slotLevel + 1;
        else cost = slotLevel + 2;
        points -= cost;

        // Slot Evaluation
        let path = `system.spells.spell${slotLevel}.value`;
        let newValue = foundry.utils.getProperty(workflow.actor, path) + 1;

        // Final Update
        await workflow.actor.update({ [path]: newValue });
        await pointsItem.update({ "system.uses.value": points });
    }


    // SLOTS TO POINTS
    else if (selection === "stp") {
        let slotsToPointsOptions = [];
        let i = 1;
        for (let slot of slots) {
            if (slot.value >= 1) slotsToPointsOptions.push([`<b>Level: ${i}</b>, Remaining: <b>${slot.value}</b>`, i]);
            i += 1;
        }
        slotsToPointsOptions.push(["Cancel", "cancel"]);
        let pointsAmmount = await mba.dialog("FC: Slots to Points", slotsToPointsOptions, `<b>Choose spell slot level:</b>`);
        if (!pointsAmmount || pointsAmmount === "cancel") return;

        // Points evaluation
        points += pointsAmmount;

        // Slot Evaluation
        let path = `system.spells.spell${pointsAmmount}.value`;
        let newValue = foundry.utils.getProperty(workflow.actor, path) - 1;

        // Final Update
        await workflow.actor.update({ [path]: newValue });
        await pointsItem.update({ "system.uses.value": points });
    }
}