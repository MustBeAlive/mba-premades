export async function iceKnife({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Ice Knife: Explosion', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Ice Knife: Explosion)');
        return
    }
    let damageDice = 1 + workflow.castData.castLevel;
    featureData.system.damage.parts = [[damageDice + 'd6[cold]', 'cold']];
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetToken = workflow.targets.first();
    let targetUuids = await chrisPremades.helpers.findNearby(targetToken, 5).concat(targetToken).map(t => t.document.uuid);
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
}