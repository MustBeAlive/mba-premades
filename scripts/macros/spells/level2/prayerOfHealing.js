// Based on CPR mass cure wounds macro
export async function prayerOfHealing({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.targets.size) return;
    let targetTokens = [];
    for (let i of workflow.targets) {
        if (i.actor.system.details.type.value != 'undead' && i.actor.system.details.type.value != 'construct') targetTokens.push(i);
    }
    if (!targetTokens.length) return;
    let diceNumber = workflow.castData.castLevel;
    let damageFormula = diceNumber + 'd8[healing] + ' + chrisPremades.helpers.getSpellMod(workflow.item);
    let damageRoll = await new Roll(damageFormula).roll({'async': true});
    await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: {'alias': name},
        flavor: workflow.item.name
    });
    let buttons = [
        {
            'label': 'Heal',
            'value': true
        }, {
            'label': 'Cancel',
            'value': false
        }
    ];
    let selection = await chrisPremades.helpers.selectTarget('What targets would you like to heal? Max: 6', buttons, targetTokens, true, 'multiple');
    if (!selection.buttons) return;
    let selectedTokens = [];
    for (let i of selection.inputs) {
        if (i) selectedTokens.push(await fromUuid(i));
    }
    if (selectedTokens.length > 6) {
        ui.notifications.info('Too many targets selected!');
        return;
    }
    chrisPremades.helpers.applyWorkflowDamage(workflow.token, damageRoll, 'healing', selectedTokens, workflow.item.name, workflow.itemCardId);
}