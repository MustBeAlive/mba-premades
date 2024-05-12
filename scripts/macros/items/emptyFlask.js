import {mba} from "../../helperFunctions.js";

export async function emptyFlask({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [];
    let flask = mba.getItem(workflow.actor, "Empty Flask");
    if (flask) choices.push([`Fill a Flask (Available: ${flask.system.quantity})`, `Flask`]);
    let vial = mba.getItem(workflow.actor, "Empty Vial");
    if (vial) choices.push([`Fill a Vial (Available: ${vial.system.quantity})`, `Vial`]);
    if (!choices.length) {
        ui.notifications.warn("Unable to find any empty vials or flasks!");
        return;
    }
    choices.push(["Cancel", "cancel"]);
    let type = await mba.dialog(`Empty Container`, choices, `<b>What would you like to do?</b>`);
    if (!type || type === "cancel") return;
    let liquids = [
        [`Fill ${type} with Water`, "Water"],
        ["Cancel", "cancel"]
    ];
    let selection = await mba.dialog(`Empty ${type}`, liquids, `<b>Choose liquid type:</b>`);
    if (!selection || selection === "cancel") return;

    let choicesGM = [["Yes, proceed", "yes"], ["No, cancel", "no"]];
    let selectionGM = await mba.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `<p><b>${workflow.token.document.name}</b> attempts to fill a <b>${type}</b> with <b>${selection}</b></p>`);
    if (selectionGM === "no") {
        ui.notifications.info("GM has denied your request");
        return;
    }

    if (selection === "Water") {
        let emptyItem = mba.getItem(workflow.actor, `Empty ${type}`);
        if (emptyItem.system.quantity > 1) {
            emptyItem.update({ "system.quantity": emptyItem.system.quantity - 1 });
        } else {
            workflow.actor.deleteEmbeddedDocuments("Item", [emptyItem.id]);
        }
        let waterItem = mba.getItem(workflow.actor, `Water ${type}`);
        if (!waterItem) {
            const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', `Water ${type}`, false);
            if (!itemData) {
                ui.notifications.warn(`Unable to find item in compenidum! (Water ${type})`);
                return
            }
            await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
        } else {
            waterItem.update({ "system.quantity": waterItem.system.quantity + 1 });
        }
    }
}