// Original macro by CPR
async function turnStart(token, origin) {
    let tempHP = chrisPremades.helpers.getSpellMod(origin);
    await chrisPremades.helpers.applyDamage([token], tempHP, 'temphp');
}
async function end(actor) {
    await actor.update({'system.attributes.hp.temp': 0});
}
async function onCast({speaker, actor, token, character, item, args, scope, workflow}) {
    let castLevel = workflow.castData.castLevel;
    if (workflow.targets.size <= castLevel) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + castLevel + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, castLevel);
    chrisPremades.helpers.updateTargets(newTargets);
}

export let heroism = {
    'turnStart': turnStart,
    'end': end,
    'early': onCast
}
