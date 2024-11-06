import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function protection(workflow) {
    let currentTarget = workflow.targets.first();
    if (!constants.attacks.includes(workflow.item?.system?.actionType)) return;
    let nearbyAllies = await mba.findNearby(currentTarget, 5, "ally", false, false);
    if (!nearbyAllies.length) return;
    let protector;
    for (let target of nearbyAllies) {
        if (protector) continue;
        if (!mba.getItem(target.actor, "Fighting Style: Protection")) continue;
        if (mba.findEffect(target.actor, "Reaction")) continue;
        let [hasShieldEquppied] = target.actor.items.filter(i => i.system.equipped === true && i.system?.armor?.type === "shield");
        if (!hasShieldEquppied) continue;
        let [canSeeAttacker] = await mba.findNearby(target, 200, "any", false, false, undefined, true).filter(t => t.document.uuid === workflow.token.document.uuid);
        if (!canSeeAttacker) continue;
        protector = target;
    }
    if (!protector) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "fsProtection", 49);
    if (!queueSetup) return;
    await mba.playerDialogMessage(mba.firstOwner(protector));
    let reaction = await mba.remoteDialog("Fighting Style: Protection", constants.yesNo, mba.firstOwner(protector).id, `<b>Use reaction to impose disadvantage<br>on the attack against <u>${currentTarget.document.name}</u>?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!reaction) {
        queue.remove(workflow.item.uuid);
        return;
    }
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS:Protection');
    new Sequence()

        .effect()
        .file("jb2a.icon.shield.blue")
        .attachTo(currentTarget)
        .scaleToObject(1.4)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 60 })

        .thenDo(async () => {
            let feature = await mba.getItem(protector.actor, "Fighting Style: Protection");
            await feature.displayCard();
            await mba.addCondition(protector.actor, "Reaction");
            queue.remove(workflow.item.uuid);
        })

        .play()
}