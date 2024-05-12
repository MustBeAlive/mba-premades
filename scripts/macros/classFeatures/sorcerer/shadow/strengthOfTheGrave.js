import {constants} from '../../../generic/constants.js';
import {mba} from '../../../../helperFunctions.js';
import {queue} from '../../../mechanics/queue.js';

export async function strengthOfTheGrave(token, { item, workflow, ditem }) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let tokenActor = token.actor;
    let effect = await mba.findEffect(tokenActor, "Strength of the Grave");
    if (!effect) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    if (!originItem.system.uses.value) return;
    if (workflow.isCritical || mba.checkTrait(tokenActor, 'di', 'healing') || mba.totalDamageType(tokenActor, ditem.damageDetail[0], 'radiant') > 0 || mba.totalDamageType(tokenActor, ditem.damageDetail[0], 'none')) return;
    let selection = await mba.dialog(originItem.name, constants.yesNo, `Use <b>${originItem.name}</b>?`);
    if (!selection || selection === false) return;
    let queueSetup = await queue.setup(workflow.uuid, 'strengthOfTheGrave', 389);
    if (!queueSetup) return;
    let featureData = duplicate(originItem.toObject());
    let damageDealt = ditem.appliedDamage;
    featureData.system.save.dc = damageDealt + featureData.system.save.dc;
    delete featureData.id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': tokenActor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    await originItem.update({
        'system.uses.value': originItem.system.uses.value - 1
    });
    if (featureWorkflow.failedSaves.size === 1) {
        queue.remove(workflow.uuid);
        return;
    }
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    queue.remove(workflow.uuid);
}