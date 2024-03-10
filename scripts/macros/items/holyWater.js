export async function holyWater({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1) return;
    let targets = Array.from(workflow.targets);
    let target = targets[0];
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'fiend' && type != 'undead') {
        ui.notifications.warn('Target is not fiend or undead!');
        return;
    };
    let damageFormula = '2d6[radiant]';
    let damageRoll = await new Roll(damageFormula).roll({'async': true});
    await chrisPremades.helpers.applyWorkflowDamage(workflow.token, damageRoll, 'radiant', targets, workflow.item.name, workflow.itemCardId);
}