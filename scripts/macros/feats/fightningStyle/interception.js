import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function interception(targetToken, { workflow, ditem }) {
    let currentTarget = targetToken;
    if (!workflow.hitTargets?.size || !constants.attacks.includes(workflow.item?.system?.actionType)) return;
    let nearbyAllies = await mba.findNearby(currentTarget, 5, "ally", false, false);
    if (!nearbyAllies.length) return;
    let interceptor;
    for (let target of nearbyAllies) {
        if (interceptor) continue;
        if (!mba.getItem(target.actor, "Fighting Style: Interception")) continue;
        if (mba.findEffect(target.actor, "Reaction")) continue;
        let [hasSimpleWeaponQuipped] = target.actor.items.filter(i => i.system.equipped === true && i.system?.weaponType === "simpleM");
        let [hasMartialWeaponQuipped] = target.actor.items.filter(i => i.system.equipped === true && i.system?.weaponType === "martialM");
        let [hasShieldEquppied] = target.actor.items.filter(i => i.system.equipped === true && i.system?.armor?.type === "shield");
        if (!hasSimpleWeaponQuipped && !hasMartialWeaponQuipped && !hasShieldEquppied) continue;
        let [canSeeAttacker] = await mba.findNearby(target, 200, "any", false, false, undefined, true).filter(t => t.document.uuid === workflow.token.document.uuid);
        if (!canSeeAttacker) continue;
        interceptor = target;
    }
    if (!interceptor) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "fsInterception", 399);
    if (!queueSetup) return;
    await mba.playerDialogMessage(mba.firstOwner(interceptor));
    let reaction = await mba.remoteDialog("Fighting Style: Interception", constants.yesNo, mba.firstOwner(interceptor).id, `<b>Use reaction to reduce damage<br>of the attack against <u>${currentTarget.document.name}</u>?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!reaction) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let formula = `1d10 + ${interceptor.actor.system.attributes.prof}`;
    let reductionRoll = await new Roll(formula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(reductionRoll);
    await reductionRoll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Fighting Style: Interception'
    });
    let value = reductionRoll.total;
    let newDamage = ditem.appliedDamage - value;
    if (newDamage <= 0) newDamage = 0;
    ditem.appliedDamage = newDamage;
    ditem.hpDamage = newDamage;
    ditem.newHP = ditem.oldHP - newDamage;

    new Sequence()

        .effect()
        .file("jb2a.condition.boon.01.001.yellow")
        .attachTo(currentTarget)
        .scaleToObject(1.8)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 220 })

        .thenDo(async () => {
            let feature = await mba.getItem(interceptor.actor, "Fighting Style: Interception");
            await feature.displayCard();
            await mba.addCondition(interceptor.actor, "Reaction");
            queue.remove(workflow.item.uuid);
        })

        .play()
}