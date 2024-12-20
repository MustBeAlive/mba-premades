import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function martialAdvantage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, "Martial Advantage: Used")) return;
    let nearbyTargets = mba.findNearby(workflow.targets.first(), 5, 'enemy', false).filter(t => t.document.uuid != workflow.token.document.uuid && !mba.findEffect(t.actor, "Incapacitated"));
    if (!nearbyTargets.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'martialAdvantage', 250);
    if (!queueSetup) return;
    let bonus = `2d6`;
    if (workflow.token.document.name === "Hobgoblin Warlord") bonus = `4d6`;
    let choices = [[`Yes (+${bonus})`, "yes"], ["No, cancel", false]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Martial Advantage", choices, "Use ability?");
    await mba.clearGMDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `${bonus}[${workflow.defaultDamageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let effectData = {
        'name': "Martial Advantage: Used",
        'icon': "modules/mba-premades/icons/generic/martial_advantage.webp",
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    queue.remove(workflow.item.uuid);
}

export let hobgoblin = {
    'martialAdvantage': martialAdvantage
}