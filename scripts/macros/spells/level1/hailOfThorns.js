// Original macro by CPR
export async function hailOfThorns({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.hitTargets.size) return;
    if (workflow.item?.system?.actionType != 'rwak') return;
    let effect = chrisPremades.helpers.findEffect(workflow.actor, 'Hail of Thorns');
    if (!effect) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hail of Thorns: Burst', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Hail of Thorns: Burst)');
        return
    }
    let damageDice = Math.min(effect.flags['midi-qol'].castData.castLevel, 6);
    featureData.system.damage.parts = [
        [
            damageDice + 'd10[piercing]',
            'piercing'
        ]
    ];
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let targetToken = workflow.targets.first();
    let targetUuids = await chrisPremades.helpers.findNearby(targetToken, 5).concat(targetToken).map(t => t.document.uuid);
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
    await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
}