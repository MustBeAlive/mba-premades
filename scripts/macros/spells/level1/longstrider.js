export async function longstrider({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel;
    if (workflow.targets.size <= ammount) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}