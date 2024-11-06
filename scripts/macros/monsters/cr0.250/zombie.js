import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function undeadFortitude(targetToken, { workflow, ditem }) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let targetActor = targetToken.actor;
    let effect = mba.findEffect(targetActor, "Undead Fortitude");
    if (!effect) effect = await mba.findEffect(targetActor, "Mutant Fortitude");
    if (!effect) return;
    if (workflow.isCritical || mba.checkTrait(targetActor, 'di', 'healing') || mba.totalDamageType(targetActor, ditem.damageDetail[0], 'radiant') > 0 || mba.totalDamageType(targetActor, ditem.damageDetail[0], 'none')) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    let queueSetup = await queue.setup(workflow.uuid, "undeadFortitude", 389);
    if (!queueSetup) return;
    //let featureData = duplicate(originItem.toObject());
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Undead Fortitude", false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Undead Fortitude)");
        return;
    }
    let damageDealt = ditem.appliedDamage;
    featureData.system.save.dc = damageDealt + featureData.system.save.dc;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetActor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) {
        queue.remove(workflow.uuid);
        return;
    }
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    let animation = "jb2a.condition.curse.01.001.red";
    if (effect.name === "Mutant Fortitude") animation = "jb2a.condition.curse.01.001.purple";
    new Sequence()

        .effect()
        .file(animation)
        .attachTo(targetToken)
        .scaleToObject(1.7)
        .fadeIn(500)
        .fadeOut(1000)

        .thenDo(async () => {
            queue.remove(workflow.uuid);
        })

        .play()
}

export let zombie = {
    'undeadFortitude': undeadFortitude
}