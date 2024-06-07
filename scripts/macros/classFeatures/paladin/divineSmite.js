import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

export async function divineSmite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1) return;
    if (workflow.item.name === 'Unarmed Strike' && !game.settings.get('mba-premades', 'Unarmed Strike Smite')) return;
    let validTypes = ['martialM', 'simpleM'];
    if (game.settings.get('mba-premades', 'Ranged Smite')) {
        validTypes.push('martialR');
        validTypes.push('simpleR');
    }
    if (!validTypes.includes(workflow.item.system.weaponType)) return;
    let feature = mba.getItem(workflow.actor, 'Divine Smite');
    if (!feature) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'divineSmite', 250);
    if (!queueSetup) return;
    let spells = workflow.actor.system.spells;
    let pactSlots = spells.pact.value;
    let pactLevel = spells.pact.level;
    let pactMax = spells.pact.max;
    let spell1 = spells.spell1.value;
    let spell1max = spells.spell1.max;
    let spell2 = spells.spell2.value;
    let spell2max = spells.spell2.max;
    let spell3 = spells.spell3.value;
    let spell3max = spells.spell3.max;
    let spell4 = spells.spell4.value;
    let spell4max = spells.spell4.max;
    let spell5 = spells.spell5.value;
    let spell5max = spells.spell5.max;
    let spell6 = spells.spell6.value;
    let spell6max = spells.spell6.max;
    let spell7 = spells.spell7.value;
    let spell7max = spells.spell7.max;
    let spell8 = spells.spell8.value;
    let spell8max = spells.spell8.max;
    let spell9 = spells.spell9.value;
    let spell9max = spells.spell9.max;
    if (pactSlots + spell1 + spell2 + spell3 + spell4 + spell5 + spell6 + spell7 + spell8 + spell9 === 0) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let choices = [];
    if (pactSlots > 0) choices.push([`Pact (${pactLevel + 1}d8) | Current: ${pactSlots}/${pactMax}`, 'p']);
    if (spell1 > 0) choices.push([`1st Level (2d8)  |  Current: <b>${spell1}/${spell1max}</b>`, 1]);
    if (spell2 > 0) choices.push([`2nd Level (3d8)  |  Current: <b>${spell2}/${spell2max}</b>`, 2]);
    if (spell3 > 0) choices.push([`3rd Level (4d8)  |  Current: <b>${spell3}/${spell3max}</b>`, 3]);
    if (spell4 > 0) choices.push([`4th Level (5d8)  |  Current: <b>${spell4}/${spell4max}</b>`, 4]);
    if (spell5 > 0) choices.push([`5th Level (5d8)  |  Current: <b>${spell5}/${spell5max}</b>`, 5]);
    if (spell6 > 0) choices.push([`6th Level (5d8)  |  Current: <b>${spell6}/${spell6max}</b>`, 6]);
    if (spell7 > 0) choices.push([`7th Level (5d8)  |  Current: <b>${spell7}/${spell7max}</b>`, 7]);
    if (spell8 > 0) choices.push([`8th Level (5d8)  |  Current: <b>${spell8}/${spell8max}</b>`, 8]);
    if (spell9 > 0) choices.push([`9th Level (5d8)  |  Current: <b>${spell9}/${spell9max}</b>`, 9]);
    choices.push(['Cancel', false]);
    let selection = await mba.dialog("Divine Smite", choices, "<b>Choose spell slot level:</b>");
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let update = {};
    let diceAmmount;
    switch (selection) {
        case 'p':
            update = { 'system.spells.pact.value': pactSlots - 1 };
            diceAmmount = pactLevel + 1;
            break;
        case 1:
            update = { 'system.spells.spell1.value': spell1 - 1 };
            diceAmmount = 2;
            break;
        case 2:
            update = { 'system.spells.spell2.value': spell2 - 1 };
            diceAmmount = 3;
            break;
        case 3:
            update = { 'system.spells.spell3.value': spell3 - 1 };
            diceAmmount = 4;
            break;
        case 4:
            update = { 'system.spells.spell4.value': spell4 - 1 };
            diceAmmount = 5;
            break;
        case 5:
            update = { 'system.spells.spell5.value': spell5 - 1 };
            diceAmmount = 5;
            break;
        case 6:
            update = { 'system.spells.spell6.value': spell6 - 1 };
            diceAmmount = 5;
            break;
        case 7:
            update = { 'system.spells.spell7.value': spell7 - 1 };
            diceAmmount = 5;
            break;
        case 8:
            update = { 'system.spells.spell8.value': spell8 - 1 };
            diceAmmount = 5;
            break;
        case 9:
            update = { 'system.spells.spell9.value': spell9 - 1 };
            diceAmmount = 5;
            break;
    }
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) === "undead" || mba.raceOrType(target.actor) === "fiend") diceAmmount += 1;
    let bonusDamageFormula = `${diceAmmount}d6[radiant]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    await workflow.actor.update(update);
    await feature.displayCard();
    new Sequence()

        .effect()
        .file("jb2a.divine_smite.target.yellowwhite")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .play()
        
    queue.remove(workflow.item.uuid);
}