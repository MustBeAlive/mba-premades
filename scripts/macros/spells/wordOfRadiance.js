export async function wordOfRadiance({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size === 0) return;
    let targets = Array.from(workflow.targets);
    let buttons = [
        {
            'label': 'Attack',
            'value': true
        }, {
            'label': 'Cancel',
            'value': false
        }
    ];
    let selectedTokens = [];
    let selection = await chrisPremades.helpers.selectTarget('Which targets would you like to attack?', buttons, targets, true, 'multiple');
    if (!selection.buttons) return;
    for (let i of selection.inputs) {
        if (i) selectedTokens.push(await fromUuid(i));
    }
    let validTargets = Array.from(selectedTokens).map(i => i.id);
    await chrisPremades.helpers.updateTargets(validTargets);
}