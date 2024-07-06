import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.hitTargets.size) return;
    let hp = workflow.actor.system.attributes.hp.value;
    let maxhp = workflow.actor.system.attributes.hp.max;
    if (hp < Math.floor(maxhp / 2)) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'championDamage', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = "2d6[slashing]";
    if (workflow.item.name === "Shortbow" || workflow.item.name === "Spear" || workflow.item.name === "War Pick") bonusDamageFormula = "2d6[piercing]";
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let champion = {
    'damage': damage
}