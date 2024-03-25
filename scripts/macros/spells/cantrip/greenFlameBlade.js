// Slightly adjusted; Original macro by CPR
export async function greenFlameBlade({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size != 1) return;
    let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && i.system.equipped && i.system.actionType === 'mwak');
    if (!weapons.length) {
        ui.notifications.info('No equipped weapons found!');
        return;
    }
    let selection;
    if (weapons.length === 1) selection = weapons[0];
    if (!selection) [selection] = await chrisPremades.helpers.selectDocument('Attack with what weapon?', weapons);
    if (!selection) return;
    let level = chrisPremades.helpers.levelOrCR(workflow.actor);
    let diceNumber = Math.floor((level + 1) / 6);
    let weaponData = duplicate(selection.toObject());
    delete weaponData._id;
    setProperty(weaponData, 'flags.chris-premades.spell.greenFlameBlade', true);
    if (level > 4) weaponData.system.damage.parts.push([diceNumber + 'd8[' + chrisPremades.translate.damageType('fire') + ']', 'fire']);
    let weapon = new CONFIG.Item.documentClass(weaponData, {'parent': workflow.actor});
    weapon.prepareData();
    weapon.prepareFinalAttributes();
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await warpgate.wait(100);
    let attackWorkflow = await MidiQOL.completeItemUse(weapon, config, options);
    if (!attackWorkflow) return;
    if (!attackWorkflow.hitTargets.size) return;
    let targets = chrisPremades.helpers.findNearby(workflow.targets.first(), 5, 'ally', true, false);
    if (!targets.length) return;
    let target;
    if (targets.length === 1) target = targets[0];
    if (!target) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, targets, true, 'one', false, false, 'Where does the fire leap?');
        if (!selection.buttons) return;
        let targetUUid = selection.inputs.find(i => i);
        if (!targetUUid) return;
        target = await fromUuid(targetUUid);
    }
    if (!target) return;
    
    new Sequence()
        .effect()
        .delay(1500)
        .atLocation(workflow.targets.first())
        .scaleToObject(2)
        .rotateTowards(target)
        .file("jb2a.fire_jet.green")
        .play();

    let modifier = chrisPremades.helpers.getSpellMod(workflow.item);
    let damageType = chrisPremades.translate.damageType('fire').toLowerCase();
    let damageFormula = level > 4 ? diceNumber + 'd8[' + damageType + '] + ' + modifier : modifier + '[' + damageType + ']';
    if (workflow.isCritical && !ignoreCrit) damageFormula = chris.getCriticalFormula(damageFormula);
    let damageRoll = await new CONFIG.Dice.DamageRoll(damageFormula, workflow.actor.getRollData(), options).evaluate();
    await chrisPremades.helpers.applyWorkflowDamage(workflow.token, damageRoll, 'fire', [target], workflow.item.name, attackWorkflow.itemCardId);
}