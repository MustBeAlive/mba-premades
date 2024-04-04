export async function holyWater({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'fiend' && type != 'undead') {
        ui.notifications.warn('Target is not fiend or undead!');
        return;
    };
    let damageFormula = '2d6[radiant]';
    let damageRoll = await new Roll(damageFormula).roll({'async': true});
    await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: `<b>Holy Water</b>`
    });
    await chrisPremades.helpers.applyWorkflowDamage(workflow.token, damageRoll, 'radiant', [target], workflow.item.name, workflow.itemCardId);
}