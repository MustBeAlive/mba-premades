import {mba} from "../../../helperFunctions.js";

async function martialAdvantage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, "Martial Advantage: Used")) return;
    let nearbyTargets = mba.findNearby(workflow.targets.first(), 5, 'enemy', false).filter(i => i.document.uuid != workflow.token.document.uuid && !mba.findEffect(i.actor, "Incapacitated"));
    if (!nearbyTargets.length) return;
    let choices = [["Yes (+2d6)", "yes"], ["No, cancel", false]];
    let selection = await mba.dialog("Martial Advantage", choices, "Use ability?");
    if (!selection) return;
    let damageType = workflow.item.system.damage.parts[0][1];
    let damageFormula = '2d6[' + damageType + "]";
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Martial Advantage'
    });
    let damageTotal = damageRoll.total;
    let hasDR = mba.checkTrait(actor, "dr", damageType);
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': damageType
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
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
}

export let hobgoblin = {
    'martialAdvantage': martialAdvantage
}