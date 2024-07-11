import {constants} from '../../../generic/constants.js';
import {mba} from '../../../../helperFunctions.js';
import {queue} from '../../../mechanics/queue.js';

export async function thunderboltStrike({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.damageRoll) return;
    let feature = mba.getItem(workflow.actor, 'Thunderbolt Strike');
    if (!feature) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'thunderboltStrike', 475);
    if (!queueSetup) return;
    let damageTypes = mba.getRollDamageTypes(workflow.damageRoll);
    if (!damageTypes.has('lightning')) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let targets = Array.from(workflow.hitTargets).filter(i => mba.getSize(i.actor) <= 3);
    if (!targets.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget("Thunderbolt Strike", constants.yesNoButton, targets, true, 'multiple', undefined, false, `<b>Choose targets to push 10 ft. away from you:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let pushTargets = selection.inputs.filter(i => i).map(i => fromUuidSync(i).object);
    if (!pushTargets.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
    for (let i of pushTargets) mba.pushToken(workflow.token, i, 10);
    queue.remove(workflow.item.uuid);
}