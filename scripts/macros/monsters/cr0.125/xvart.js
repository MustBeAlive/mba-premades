import {mba} from "../../../helperFunctions.js";

async function pushingAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let nearbyTargets = mba.findNearby(target, 5, 'enemy', false).filter(i => i.document.uuid != workflow.token.document.uuid);
    if (!nearbyTargets.length) return;
    if (mba.getSize(target.actor) > 2) return;
    let choices = [['Yes', 'yes'], ['No', false]];
    let selection = await mba.dialog("Xvart: Pushing Attack", choices, `Do you wish to push target 5 ft. away?`);
    if (!selection) return;
    await mba.pushToken(workflow.token, target, 5);
}

async function lowCunning({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.sneak_attack.dark_purple")
        .atLocation(token)

        .play()

    let actionName = "Disengage";
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

export let xvart = {
    'pushingAttack': pushingAttack,
    'lowCunning': lowCunning
}