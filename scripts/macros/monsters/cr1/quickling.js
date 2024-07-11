import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function blurredMovement(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    if (!constants.attacks.includes(workflow.item.system?.actionType)) return;
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, "Blurred Movement")) return;
    if (mba.findEffect(target.actor, "Incapacitated") || target.actor.system.attributes.movement.walk === 0) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "blurredMovement", 50);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS: Blurred Movement');
    queue.remove(workflow.item.uuid);
}

async function blurredMovementCombatStart(token) {
    let effect = await mba.findEffect(token.actor, "Blurred Movement");
    if (!effect) return;
    let updates = {
        'changes': [
            {
                'key': 'macro.tokenMagic',
                'mode': 0,
                'value': "blur",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

export let quickling = {
    'blurredMovement': blurredMovement,
    'blurredMovementCombatStart': blurredMovementCombatStart
}