async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    if (workflow.targets.size > ammount) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        await chrisPremades.helpers.updateTargets(newTargets);
    }
    let targets = Array.from(game.user.targets);
    const distanceArray = [];
    for (let i = 0; i < targets.length; i++) {
        for (let k = i + 1; k < targets.length; k++) {
            let target1 = fromUuidSync(targets[i].document.uuid).object;
            let target2 = fromUuidSync(targets[k].document.uuid).object;
            distanceArray.push(chrisPremades.helpers.getDistance(target1, target2));
        }
    }
    const found = distanceArray.some((distance) => distance > 30);
    if (found === true) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other!')
        return;
    }
    await warpgate.wait(100);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Tasha\'s Mind Whip: Damage', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Tasha's Mind Whip: Damage)");
        return
    }
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) {
        targetUuids.push(i.document.uuid);
    }
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await warpgate.wait(100);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function turnStart(actor, token) {
    let choices = [
        ['Action', 'action'],
        ['Bonus Action', 'bonus'],
        ['Movement', 'move']
    ];
    let selection = await chrisPremades.helpers.dialog("Tasha's Mind Whip", choices, `<b>Choose what action you would like to keep:</b>`);
    if (!selection) {
        return;
    }
    let flavor;
    switch (selection) {
        case 'action': {
            flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep <b>Action</b>`;
            break;
        }
        case 'bonus': {
            flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep <b>Bonus Action</b>`;
            break;
        }
        case 'move': {
            flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep <b>Movement Action</b>`;
        }
    }
    ChatMessage.create({
        flavor: flavor,
        speaker: ChatMessage.getSpeaker({ actor: actor })
    });
}

export let tashaMindWhip = {
    'item': item,
    'turnStart': turnStart
}