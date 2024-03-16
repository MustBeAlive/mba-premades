// Make something better in PC case; work with animation
export async function powerWordKill({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let currentHP = target.actor.system.attributes.hp.value;
    if (currentHP <= 100) {
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
        await warpgate.wait(3500);
        if (target.actor.type === "npc") {
            await chrisPremades.helpers.applyDamage([target], currentHP, 'none');
            return;
        }
        await chrisPremades.helpers.applyDamage([target], currentHP, 'none');
        await target.actor.update({ "system.attributes.death.failure": 3});
        await warpgate.wait(100);
        await chrisPremades.helpers.removeCondition(target.actor, 'Unconscious');
        await chrisPremades.helpers.addCondition(target.actor, 'Dead', true);
    } else {
        ui.notifications.warn('Target HP is higher than 100!');
        return;
    }
}