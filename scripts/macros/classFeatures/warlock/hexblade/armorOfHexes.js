import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

async function hook(workflow) {
    if (!mba.findEffect(workflow.actor, "Hexblade's Curse: Target")) return;
    if (workflow.isCritical) return;
    if (!workflow.hitTargets.size || workflow.isFumble === true) return;
    let target = workflow.targets.first();
    let armorEffect = mba.findEffect(target.actor, 'Armor of Hexes');
    if (!armorEffect) return;
    if (mba.findEffect(target.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'armorOfHexes', 49);
    if (!queueSetup) return;
    await mba.playerDialogMessage();
    let selection = await mba.remoteDialog("Armor of Hexes", constants.yesNo, mba.firstOwner(target).id, "<b>Use Armor of Hexes?</b>");
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let feature = await mba.getItem(target.actor, "Armor of Hexes");
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    if (feature) await mba.remoteRollItem(feature, config, options, mba.firstOwner(target).id); 
    await mba.addCondition(target.actor, "Reaction");
    let roll = await new Roll('1d6').roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(roll);
    roll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Armor of Hexes'
    });
    if ((workflow.attackTotal - roll.total) < target.actor.system.attributes.ac.value) {
        workflow.hitTargets.delete(workflow.targets.first());
        await ChatMessage.create({
            'speaker': { 'alias': name },
            'content': `<b>${workflow.token.document.name}</b> misses!</b>.`
        });
        queue.remove(workflow.item.uuid);
    }
    else {
        await ChatMessage.create({
            'speaker': { 'alias': name },
            'content': `<b>${workflow.token.document.name}</b> still hits <u>${target.document.name}</u>!</b>.`
        });
        queue.remove(workflow.item.uuid);
    }
}

export let armorOfHexes = {
    'hook': hook
}