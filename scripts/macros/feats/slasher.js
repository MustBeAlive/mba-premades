import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

async function slow({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.damageRoll || !constants.attacks.includes(workflow.item.system.actionType)) return;
    let originItem = mba.getItem(workflow.actor, "Slasher: Reduce Speed");
    if (!originItem) return;
    let doExtraDamage = mba.perTurnCheck(originItem, "feat", "slasher", false, workflow.token.id);
    if (!doExtraDamage) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'slasherSlow', 250);
    if (!queueSetup) return;
    let damageTypes = mba.getRollDamageTypes(workflow.damageRoll);
    if (!damageTypes.has("slashing")) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let target = workflow.targets.first();
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Slasher: Reduce Speed", constants.yesNo, `Slow ${target.document.name}?`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    if (mba.inCombat()) await originItem.setFlag("mba-premades", "feat.slasher.turn", `${game.combat.round}-${game.combat.turn}`);
    let effectData = {
        'name': "Slasher: Speed Penalty",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You have -10 to your speed until the start of ${workflow.token.document.name}'s next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': '-10',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource', 'combatEnd', 'zeroHP'],
            }
        }
    };
    await originItem.displayCard();
    await mba.createEffect(workflow.targets.first().actor, effectData);
    queue.remove(workflow.item.uuid);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feat.slasher.turn', '');
}

async function critical({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.isCritical || !workflow.damageRoll) return;
    let originItem = mba.getItem(workflow.actor, "Slasher: Critical Hit");
    if (!originItem) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'slasherCritical', 251);
    if (!queueSetup) return;
    let damageTypes = mba.getRollDamageTypes(workflow.damageRoll);
    if (!damageTypes.has('slashing')) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let effectData = {
        'name': "Slasher: Critical Hit",
        'icon': "modules/mba-premades/icons/generic/slasher.webp",
        'origin': originItem.uuid,
        'description': `
            <p>You are grievously wounded and have disadvantage on all attack rolls until the start of ${workflow.token.document.name}'s next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 0,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource', 'combatEnd', 'zeroHP'],
            }
        }
    };
    await originItem.displayCard();
    await mba.createEffect(workflow.targets.first().actor, effectData);
    queue.remove(workflow.item.uuid);
}

export let slasher = {
    'slow': slow,
    'combatEnd': combatEnd,
    'critical': critical
}