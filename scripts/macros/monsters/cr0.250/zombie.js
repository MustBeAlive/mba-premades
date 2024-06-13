import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function undeadFortitude(targetToken, { workflow, ditem }) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let targetActor = targetToken.actor;
    let effect = mba.findEffect(targetActor, 'Undead Fortitude');
    if (!effect) return;
    if (workflow.isCritical || mba.checkTrait(targetActor, 'di', 'healing') || mba.totalDamageType(targetActor, ditem.damageDetail[0], 'radiant') > 0 || mba.totalDamageType(targetActor, ditem.damageDetail[0], 'none')) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    let queueSetup = await queue.setup(workflow.uuid, 'undeadFortitude', 389);
    if (!queueSetup) return;
    let featureData = duplicate(originItem.toObject());
    let damageDealt = ditem.appliedDamage;
    featureData.system.save.dc = damageDealt + featureData.system.save.dc;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetActor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size === 1) {
        queue.remove(workflow.uuid);
        return;
    }
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    queue.remove(workflow.uuid);
}

export let zombie = {
    'undeadFortitude': undeadFortitude
}