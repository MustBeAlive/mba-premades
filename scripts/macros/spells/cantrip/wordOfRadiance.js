export async function wordOfRadiance({speaker, actor, token, character, item, args, scope, workflow}) {
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep:');
    if (selection.buttons === false) return;
    let newTargets = selection.inputs.filter(i => i).slice(0);
    chrisPremades.helpers.updateTargets(newTargets);
}