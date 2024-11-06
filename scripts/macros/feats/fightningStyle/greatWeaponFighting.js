import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function greatWeaponFighting({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.damageRoll || workflow.item?.system?.actionType != "mwak") return;
    if (!workflow.item.system.properties.two === true && !workflow.item.system.properties.ver === true) return;
    if (workflow.item.system.properties.ver === true && !workflow.rollOptions.versatile === true) return;
    let originItem = mba.getItem(workflow.actor, "Fighting Style: Great Weapon Fighting");
    if (!originItem) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "fsGWF", 389);
    if (!queueSetup) return;
    let resultI = [];
    let resultJ = [];
    let dieSize = null;
    let term = workflow.damageRoll.terms[0];
    if (!term.faces) {
        ui.notifications.warn("Unable to find weapon die roll!");
        return;
    }
    for (let j = 0; term.results.length > j; j++) {
        let rollResult = term.results[j].result;
        if (rollResult > 2) continue;
        dieSize = term.faces;
        resultI.push(rollResult);
        resultJ.push(j);
    }
    if (!resultJ.length) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog(originItem.name, constants.yesNo, `<p>Low die roll: <b>${resultI}</b></p><p>Would you like to reroll?</p>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let newDamageRoll = workflow.damageRoll;
    for (let i = 0; i < resultJ.length; i++) {
        let roll = await new Roll(`1d${dieSize}`).roll({ 'async': true });
        MidiQOL.displayDSNForRoll(roll);
        newDamageRoll.terms[0].results[resultJ[i]].result = roll.total;
    }
    newDamageRoll._total = newDamageRoll._evaluateTotal();
    await workflow.setDamageRoll(newDamageRoll);
    await originItem.displayCard();
    queue.remove(workflow.item.uuid);
}