import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.advantage) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'championDamage', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = "2d6[psychic]";
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

async function shadowStealth({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.checkLight(workflow.token) === "bright") {
        ui.notifications.warn("Shadow Demon is in bright light!");
        return;
    }
    let actionName = "Hide";
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
    await MidiQOL.completeItemUse(action, {}, options);
}

export let shadowDemon = {
    'damage': damage,
    'shadowStealth': shadowStealth
}