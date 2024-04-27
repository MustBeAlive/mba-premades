export async function emptyFlask({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [];
    let [flask] = workflow.actor.items.filter(i => i.name === "Empty Flask");
    if (flask) choices.push([`Fill a Flask (Available: ${flask.system.quantity})`, `Flask`]);
    let [vial] = workflow.actor.items.filter(i => i.name === "Empty Vial");
    if (vial) choices.push([`Fill a Vial (Available: ${vial.system.quantity})`, `Vial`]);
    if (!choices.length) {
        ui.notifications.warn("Unable to find any empty vials or flasks!");
        return;
    }
    choices.push(["Cancel", "cancel"]);
    let type = await chrisPremades.helpers.dialog("What would you like to do?", choices);
    if (!type || type === "cancel") return;
    let liquids = [
        [`Fill ${type} with Water`, "Water"],
        ["Cancel", "cancel"]
    ];
    let selection = await chrisPremades.helpers.dialog("What would you like to do?", liquids);
    if (!selection || selection === "cancel") return;

    let choicesGM = [["Yes, proceed", "yes"], ["No, cancel", "no"]];
    let selectionGM = await chrisPremades.helpers.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `<p><b>${workflow.token.document.name}</b> attempts to fill a <b>${type}</b> with <b>${selection}</b></p>`);
    if (selectionGM === "no") {
        ui.notifications.info("GM has denied your request");
        return;
    }

    if (selection === "Water") {
        let emptyItem = workflow.actor.items.filter(i => i.name === `Empty ${type}`)[0];
        if (emptyItem.system.quantity > 1) {
            emptyItem.update({ "system.quantity": emptyItem.system.quantity - 1 });
        } else {
            workflow.actor.deleteEmbeddedDocuments("Item", [emptyItem.id]);
        }
        let waterItem = workflow.actor.items.filter(i => i.name === `Water ${type}`)[0];
        console.log(waterItem);
        if (!waterItem) {
            const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', `Water ${type}`, false);
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