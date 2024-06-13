import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function swarm({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1) return;
    let hp = workflow.actor.system.attributes.hp.value;
    let maxhp = workflow.actor.system.attributes.hp.max;
    if (hp > Math.floor(maxhp / 2)) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'swarmDamage', 50);
    if (!queueSetup) return;
    let damageFormula = workflow.damageRoll._formula;
    let diceNum = Number(damageFormula.substring(0, 1)) / 2;
    let restOfFormula = damageFormula.substring(1);
    let newFormula = diceNum + restOfFormula;
    if (workflow.isCritical && !ignoreCrit) newFormula = mba.getCriticalFormula(newFormula);
    let damageRoll = await new CONFIG.Dice.DamageRoll(newFormula, workflow.actor.getRollData(), undefined).evaluate();
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}