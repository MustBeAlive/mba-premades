import {mba} from "../../../helperFunctions.js";

export async function nimbleEscape({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.sneak_attack.dark_green")
        .atLocation(workflow.token)
        .scaleToObject(2.5)

        .play()

    let choices = [["Disengage", "Disengage"], ["Hide", "Hide"]];
    let actionName = await mba.dialog("Nimble Escape", choices, "Choose action type:");
    if (!actionName) return;
    let action = mba.getItem(workflow.actor, actionName);
    if (action) {
        await action.use();
        return;
    }
    let actionData = await mba.getItemFromCompendium('mba-premades.MBA Actions', actionName, false);
    if (!actionData) {
        ui.notifications.warn(`Unable to find item in compendium! (${actionName})`);
        return;
    }
    action = new CONFIG.Item.documentClass(actionData, { parent: workflow.actor });
    let options = {
        'showFullCard': false,
        'createWorkflow': true,
        'targetUuids': [workflow.token.document.uuid],
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