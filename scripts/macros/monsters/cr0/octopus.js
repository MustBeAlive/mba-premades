import {mba} from "../../../helperFunctions.js";

async function inkCloud({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let size = 3.5;
    if (workflow.token.document.name === "Giant Octopus") size = 8.5;
    new Sequence()

        .effect()
        .file("jb2a.darkness.black")
        .attachTo(template)
        .size(size, { gridUnits: true })
        .opacity(0.7)
        .fadeOut(1000)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .persist()
        .name(`Ink Cloud`)

        .play()

    let action = mba.getItem(workflow.actor, "Dash");
    if (action) {
        await action.use();
        return;
    }
    let actionData = await mba.getItemFromCompendium('mba-premades.MBA Actions', "Dash", false);
    if (!actionData) {
        ui.notifications.warn(`Unable to find item in compendium! (Dash)`);
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

export let octopus = {
    'inkCloud': inkCloud
}