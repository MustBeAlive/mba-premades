import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';
import {queue} from '../../mechanics/queue.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || workflow.isFumble || workflow.item.type != 'weapon') return;
    let feature = mba.getItem(workflow.actor, 'Divine Strike')
    if (!feature) return;
    let doExtraDamage = mba.perTurnCheck(feature, 'feature', 'divineStrike', true, workflow.token.id);
    if (!doExtraDamage) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'divineStrike', 250);
    if (!queueSetup) return;
    let diceNumber = 1;
    let clericLevel = workflow.actor.classes.cleric?.system?.levels;
    let subClassIdentifier = workflow.actor.classes.cleric?.subclass?.identifier;
    if (clericLevel >= 14) diceNumber += 1;
    if (!clericLevel || !subClassIdentifier) {
        queue.remove(workflow.item.uuid);
        return;
    }
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Divine Strike", constants.yesNo, `<b>Apply extra damage? (${diceNumber}d8)</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    if (mba.inCombat()) await feature.setFlag('mba-premades', 'feature.divineStrike.turn', game.combat.round + '-' + game.combat.turn);
    let damageType;
    switch (subClassIdentifier) {
        case 'death-domain':
            damageType = 'necrotic';
            break;
        case 'forge-domain':
            damageType = 'fire';
            break;
        case 'light-domain':
            damageType = 'radiant';
            break;
        case 'nature-domain':
            damageType = await mba.dialog('Divine Strike: Damage Type', [['Cold', 'cold'], ['Fire', 'fire'], ['Lightning', 'lightning']], "<b>Choose damage type:</b>");
            if (!damageType) {
                queue.remove(workflow.item.uuid);
                return;
            }
            break;
        case 'order-domain':
            damageType = 'psychic';
            break;
        case 'tempest-domain':
            damageType = 'thunder';
            break;
        case 'trickery-domain':
            damageType = 'poison';
            break;
        case 'war-domain':
            damageType = workflow.defaultDamageType;
            break;
        default:
            damageType = 'radiant';
            break;
    }
    let bonusDamageFormula = `${diceNumber}d8[${damageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feature.divineStrike.turn', '');
}

export let divineStrike = {
    'item': item,
    'combatEnd': combatEnd
}