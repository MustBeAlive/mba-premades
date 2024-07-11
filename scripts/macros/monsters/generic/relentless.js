import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function relentless(token, { item, workflow, ditem }) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let effect = mba.findEffect(token.actor, 'Relentless');
    if (!effect) return;
    let threshold = 7;
    if (token.document.name === "Giant Boar") threshold = 10;
    else if (token.document.name === "Wereboar") threshold = 14;
    if (ditem.appliedDamage > ditem.oldHP + threshold) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    if (originItem.system.uses.value === 0) return;
    let queueSetup = await queue.setup(workflow.uuid, 'relentless', 389);
    if (!queueSetup) return;
    await originItem.update({ 'system.uses.value': originItem.system.uses.value - 1 });
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    await new Sequence()

        .effect()
        .file('jb2a.extras.tmfx.outpulse.circle.02.normal')
        .atLocation(token)
        .size(4, { 'gridUnits': true })
        .opacity(0.25)

        .effect()
        .file('jb2a.impact.ground_crack.orange.02')
        .atLocation(token)
        .belowTokens()
        .filter('ColorMatrix', { 'hue': 20, 'saturate': 1 })
        .size(3.5, { 'gridUnits': true })
        .zIndex(1)

        .effect()
        .file('jb2a.impact.ground_crack.still_frame.02')
        .atLocation(token)
        .belowTokens()
        .fadeIn(2000)
        .filter('ColorMatrix', { 'hue': -15, 'saturate': 1 })
        .size(3.5, { 'gridUnits': true })
        .duration(8000)
        .fadeOut(3000)
        .zIndex(0)

        .thenDo(async () => {
            await originItem.displayCard();
            queue.remove(workflow.uuid);
        })

        .play()
}