import { mba } from '../../helperFunctions.js';
import { constants } from '../generic/constants.js';
import { queue } from '../mechanics/queue.js';

async function reroll({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size === 0 || !workflow.damageRoll || !['mwak', 'rwak', 'msak', 'rsak'].includes(workflow.item.system.actionType)) return;
    let originItem = mba.getItem(workflow.actor, 'Piercer: Reroll Damage');
    if (!originItem) return;
    let doExtraDamage = mba.perTurnCheck(originItem, "feat", "piercer", false, workflow.token.id);
    if (!doExtraDamage) return;
    if (mba.inCombat()) {
        let currentTurn = game.combat.round + '-' + game.combat.turn;
        if (currentTurn === originItem.flags['mba-premades']?.feat?.piercer?.turn) return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'piercerReroll', 390);
    if (!queueSetup) return;
    let damageTypes = mba.getRollDamageTypes(workflow.damageRoll);
    if (!damageTypes.has('piercing')) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let autoPiercer = false;
    let lowRoll = null;
    let lowRollDice = null;
    let resultI;
    let resultJ;
    for (let i = 0; workflow.damageRoll.terms.length > i; i++) {
        let term = workflow.damageRoll.terms[i];
        if (!term.faces) continue;
        for (let j = 0; term.results.length > j; j++) {
            if (term.results[j].result > lowRoll && lowRoll != null) continue;
            if (term.results[j].result === lowRoll && term.faces < lowRollDice) continue;
            lowRoll = term.results[j].result;
            lowRollDice = term.faces;
            resultI = i;
            resultJ = j;
        }
    }
    if (autoPiercer) {
        if (lowRoll > autoPiercer) {
            queue.remove(workflow.item.uuid);
            return;
        }
    } else {
        let selection = await mba.dialog(originItem.name, constants.yesNo, `<p>Roll Result: <b>${lowRoll}</b></p><p>Would you like to reroll?</p>`);
        if (!selection) {
            queue.remove(workflow.item.uuid);
            return;
        }
    }
    if (mba.inCombat()) await originItem.setFlag('mba-premades', 'feat.piercer.turn', game.combat.round + '-' + game.combat.turn);
    let roll = await new Roll('1d' + lowRollDice).roll({ 'async': true });
    let newDamageRoll = workflow.damageRoll;
    newDamageRoll.terms[resultI].results[resultJ].result = roll.total;
    newDamageRoll._total = newDamageRoll._evaluateTotal();
    await workflow.setDamageRoll(newDamageRoll);
    await originItem.use();
    queue.remove(workflow.item.uuid);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feat.piercer.turn', '');
}

async function critical({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.isCritical || !workflow.damageRoll) return;
    let feature = mba.getItem(workflow.actor, 'Piercer: Critical Hit');
    if (!feature) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'piercerCritical', 250);
    if (!queueSetup) return;
    let damageTypes = mba.getRollDamageTypes(workflow.damageRoll);
    if (!damageTypes.has('piercing')) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageType = "piercing";
    let damageRoll = workflow.damageRoll;
    if (!damageRoll) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let largeDice;
    for (let i of damageRoll.terms) {
        if (!i.faces) continue;
        if (largeDice > i.faces) continue;
        largeDice = i.faces;
    }
    if (!largeDice) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d' + largeDice + '[' + damageType + ']';
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRollNew = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRollNew);
    await feature.use();
    queue.remove(workflow.item.uuid);
}

export let piercer = {
    'reroll': reroll,
    'combatEnd': combatEnd,
    'critical': critical
};