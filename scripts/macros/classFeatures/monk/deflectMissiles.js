import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

// To do: rework

export async function deflectMissiles({ speaker, actor, token, character, item, args, scope, workflow }) {
    let monk = workflow.targets.first();
    if (mba.findEffect(monk.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'deflectMissiles', 390);
    if (!queueSetup) return;
    let selection = await mba.remoteDialog("Deflect Missiles", constants.yesNo, mba.firstOwner(monk).id, "Use reaction to deflect the missile?");
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    // await feature.displayCard(); // feature = orinal item on actor;
    await mba.addCondition(monk.actor, "Reaction");
    let monkLevel = monk.actor.classes.monk?.system?.levels;
    let deflectFormula = `1d10 + ${monk.actor.system.abilities.dex.mod} + ${monkLevel}`;
    let deflectRoll = await new Roll(deflectFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(deflectRoll);
    await deflectRoll.toMessage({
        flavor: `Deflect Missiles roll: <b>${deflectRoll.total}</b>`,
        speaker: ChatMessage.getSpeaker({ token: monk.document })
    });
    let newHP;
    let throwCheck = false;
    if ((workflow.damageRoll.total - deflectRoll.total) < 0) {
        newHP = workflow.damageItem.oldHP;
        throwCheck = true;
    }
    else newHP = workflow.damageItem.oldHP - (workflow.damageRoll.total - deflectRoll.total);
    workflow.damageItem.newHP = newHP;
    workflow.damageItem.appliedDamage = workflow.damageItem.appliedDamage - deflectRoll.total;
    if (workflow.damageItem.appliedDamage < 0) workflow.damageItem.appliedDamage = 0;
    workflow.damageItem.hpDamage = workflow.damageItem.hpDamage - deflectRoll.total;
    if (workflow.damageItem.hpDamage < 0) workflow.damageItem.hpDamage = 0;
    queue.remove(workflow.item.uuid);
    let kiItem = await mba.getItem(monk.actor, "Ki Points");
    if (!kiItem) return;
    let kiPoints = kiItem.system.uses.value;
    if (!throwCheck || kiPoints < 1) return;
    let throwSelection = await mba.remoteDialog("Deflect Missiles", constants.yesNo, mba.firstOwner(monk).id, "Would you like to spend 1 Ki Point<br>to throw the ammunition you caught at someone?");
    if (!throwSelection) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Deflect Missiles: Throw Ammunition', false);
    if (!featureData) return;
    let damageType = workflow.defaultDamageType;
    let monkDice = 4;
    if (monkLevel >= 5 && monkLevel < 11) monkDice = 6;
    else if (monkLevel >= 12 && monkLevel < 17) monkDice = 8;
    else if (monkLevel >= 17) monkDice = 10;
    let feature = await mba.getItem(monk.actor, "Deflect Missiles");
    feature.system.damage.parts = [[`1d${monkDice} + @mod[${damageType}]`, `${damageType}`]];
    let targets = await MidiQOL.findNearby(-1, monk, 60, { includeIncapacitated: false, canSee: true, includeToken: false });
    if (!targets.length) {
        ui.notifications.warn("No valid targets within maximum range!");
        return;
    }
    let selectionMissile = await mba.remoteSelectTarget(mba.firstOwner(monk).id, "Deflect Missiles: Throw Ammunition", constants.okCancel, targets, true, "one", undefined, false, `<b>Select target to attack:</b>`);
    if (!selectionMissile.buttons) return;
    let [targetUuid] = selectionMissile.inputs.filter(i => i).slice(0);
    let [config, options] = constants.syntheticItemWorkflowOptions([targetUuid]);
    let featureworkflow = await mba.remoteRollItem(feature, config, options, mba.firstOwner(monk).id);
}