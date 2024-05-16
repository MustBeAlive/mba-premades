import {mba} from "../../../helperFunctions.js";

export async function cunningAction({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Dash", "Dash"], ["Disengage", "Disengage"], ["Hide", "Hide"]];
    if (mba.getItem(workflow.actor, "Fast Hands")) choices.push(["Use Thieves' Tools (Fast Hands)", "fasthands"]);
    let actionName = await mba.dialog("Cunning Action", choices, `<b>Choose action type:</b>`);
    if (!actionName) return;

    new Sequence()

        .effect()
        .file("jb2a.sneak_attack.dark_purple")
        .atLocation(token)
        .scaleToObject(2.5)

        .play()

    if (actionName === "fasthands") {
        let item = workflow.actor.items.getName("Thieves' Tools");
        if (!item) {
            ui.notifications.warn("Unable to find item! (Thieves' Tools)");
            return;
        }
        await item.use();
        return;
    }
    let action = token.actor.items.getName(actionName);
    if (action) {
        await action.use();
        return;
    }
    let actionData = await mba.getItemFromCompendium('mba-premades.MBA Actions', actionName, false);
    if (!actionData) {
        ui.notifications.warn(`Unable to find item in the compendium! (${actionName})`);
        return;
    }
    action = new CONFIG.Item.documentClass(actionData, { parent: token.actor });
    let targetUuids;
    if (!game.user.targets.size) targetUuids = [token.document.uuid];
    else targetUuids = [game.user.targets.first().document.uuid];
    let options = {
        'showFullCard': false,
        'createWorkflow': true,
        'targetUuids': targetUuids,
        'configureDialog': false,
        'versatile': false,
        'consumeResource': false,
        'consumeSlot': false,
        'workflowOptions': {
            'autoRollDamage': 'always',
            'autoFastDamage': true
        }
    };
    await MidiQOL.completeItemUse(action, {}, options);
}