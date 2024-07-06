import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function surpriseAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (game.combat.round != 1) return;
    let target = workflow.targets.first();
    let [targetCombatant] = game.combat.combatants.filter(i => i.tokenId === target.document.id);
    if (!targetCombatant) return;
    if (game.combat.combatant.initiative < targetCombatant.initiative) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'surpriseAttack', 250);
    if (!queueSetup) return;
    let feature = await mba.getItem(workflow.actor, "Surprise Attack");
    let damageType = workflow.defaultDamageType;
    let bonusDamageFormula = `3d6[${damageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    if (feature) await feature.displayCard();
    queue.remove(workflow.item.uuid);
}

export let doppelganger = {
    'surpriseAttack': surpriseAttack
}