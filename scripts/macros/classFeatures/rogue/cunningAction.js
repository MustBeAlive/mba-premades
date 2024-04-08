//needs testing
export async function cunningAction({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.sneak_attack.dark_purple")
        .atLocation(token)


        .play()

    let choices = [
        ["Dash", "Dash"],
        ["Disengage", "Disengage"],
        ["Hide", "Hide"]
    ];
    let actionName = await chrisPremades.helpers.dialog("Choose action type:", choices);
    if (!actionName) return;
    let action = token.actor.items.getName(actionName);
    if (action) {
        await action.use();
        return;
    }
    let actionData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Actions', actionName, false);
    if (!actionData) {
        ui.notifications.warn(`Unable to find item in compendium! (${actionName})`);
        return;
    }
    action = new CONFIG.Item.documentClass(actionData, {parent: token.actor});
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