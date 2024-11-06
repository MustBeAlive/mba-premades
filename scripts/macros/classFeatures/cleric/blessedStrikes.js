import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function onUse({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.hitTargets.size || !workflow.damageRoll) return;
    let itemType = workflow.item.type;
    if (!(itemType === 'weapon' || (itemType === 'spell' && workflow.castData.castLevel === 0))) return;
    let originItem = mba.getItem(workflow.actor, 'Blessed Strikes');
    if (!originItem) return;
    if (mba.inCombat()) {
        let featureUsed = originItem.flags['mba-premades']?.feature?.blessedStrikes?.used;
        if (featureUsed) return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'blessedStrikes', 150);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Blessed Strikes", constants.yesNo, `<b>Apply extra damage? (1d8[radiant])</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let bonusDamageFormula = '1d8[radiant]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    if (mba.inCombat()) await originItem.setFlag('mba-premades', 'feature.blessedStrikes.used', true);
    queue.remove(workflow.item.uuid);
}

async function turnStart(origin) {
    await origin.setFlag('mba-premades', 'feature.blessedStrikes.used', false);
}

export let blessedStrikes = {
    'onUse': onUse,
    'turnStart': turnStart
}