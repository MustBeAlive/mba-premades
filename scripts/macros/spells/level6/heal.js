import {mba} from "../../../helperFunctions.js";

// To do: animations

export async function heal({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type === "undead" || type === "construct") {
        ui.notifications.warn("Heal fails!");
        return false;
    }
    let ammount = (workflow.castData.castLevel * 10) + 10;
    let formula = ammount.toString();
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
    let hasBlindness = await mba.findEffect(target.actor, 'Blinded');
    if (hasBlindness) await mba.removeEffect(hasBlindness);
    let hasDeafness = await mba.findEffect(target.actor, 'Deafened');
    if (hasDeafness) await mba.removeEffect(hasDeafness);
    let feeblemind = await mba.findEffect(target.actor, "Feeblemind");
    if (feeblemind) await mba.removeEffect(feeblemind);
}