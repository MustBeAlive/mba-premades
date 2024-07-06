import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function relentless(token, { item, workflow, ditem }) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let tokenActor = token.actor;
    let effect = mba.findEffect(tokenActor, 'Relentless');
    if (!effect) return;
    let threshold = 7;
    if (token.document.name === "Giant Boar") threshold = 10;
    if (ditem.appliedDamage > ditem.oldHP + threshold) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    if (originItem.system.uses.value === 0) return;
    let queueSetup = await queue.setup(workflow.uuid, 'relentless', 389);
    if (!queueSetup) return;
    await originItem.update({ 'system.uses.value': originItem.system.uses.value - 1 });
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    await originItem.displayCard();
    queue.remove(workflow.uuid);
}