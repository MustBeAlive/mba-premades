import {mba} from "../../../helperFunctions.js";

export async function powerWordKill({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let currentHP = target.actor.system.attributes.hp.value;

    new Sequence()

        .effect()
        .file("jb2a.sacred_flame.source.purple")
        .atLocation(target)
        .anchor(0.5)
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)

        .effect()
        .file("jb2a.sacred_flame.target.purple")
        .atLocation(target)
        .scaleToObject(2.5)
        .anchor(0.5)
        .fadeIn(250)
        .fadeOut(500)
        .delay(1500)

        .play();

    if (currentHP > 100) {
        ui.notifications.warn('Target HP is higher than 100!');
        return;
    }

    await warpgate.wait(3500);
    if (target.actor.type === "npc") {
        await mba.applyDamage([target], currentHP, 'none');
        return;
    }
    await mba.applyDamage([target], currentHP, 'none');
    await target.actor.update({ "system.attributes.death.failure": 3 });
    await warpgate.wait(100);
    await mba.removeCondition(target.actor, 'Unconscious');
    await mba.addCondition(target.actor, 'Dead', true);
}