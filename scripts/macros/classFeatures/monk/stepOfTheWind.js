import {mba} from "../../../helperFunctions.js";

export async function stepOfTheWind({ speaker, actor, token, character, item, args, scope, workflow }) {
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 1) {
        ui.notifications.info("Not enough Ki Points!");
        return;
    }
    let choices = [["Dash", "Dash"], ["Disengage", "Disengage"]];
    let actionName = await mba.dialog("Step of the Wind", choices, "<b>Choose action type:</b>");
    if (!actionName) return;
    let action = mba.getItem(workflow.actor, actionName);
    if (action) {
        await action.use();
        return;
    }
    let actionData = await mba.getItemFromCompendium('mba-premades.MBA Actions', actionName, false);
    if (!actionData) {
        ui.notifications.warn(`Unable to find item in the compendium! (${actionName})`);
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
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your jump distance is doubled for the turn.</p>
        `,
        'duration': {
            'turns': 1
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    await kiItem.update({ "system.uses.value": kiPoints -= 1 });
    await MidiQOL.completeItemUse(action, {}, options);
}