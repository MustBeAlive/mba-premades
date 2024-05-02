import { mba } from "../../../helperFunctions.js";
import { constants } from "../../generic/constants.js";

export async function greenFlameBlade({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && i.system.equipped && i.system.actionType === 'mwak');
    if (!weapons.length) {
        ui.notifications.info('No equipped weapons found!');
        return;
    }
    let selection;
    if (weapons.length === 1) selection = weapons[0];
    if (!selection) [selection] = await mba.selectDocument('Attack with what weapon?', weapons);
    if (!selection) return;
    let level = mba.levelOrCR(workflow.actor);
    let diceNumber = Math.floor((level + 1) / 6);
    let weaponData = duplicate(selection.toObject());
    delete weaponData._id;
    setProperty(weaponData, 'flags.mba-premades.spell.greenFlameBlade', true);
    if (level > 4) weaponData.system.damage.parts.push([diceNumber + 'd8[fire]', 'fire']);
    let weapon = new CONFIG.Item.documentClass(weaponData, { 'parent': workflow.actor });
    weapon.prepareData();
    weapon.prepareFinalAttributes();
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await warpgate.wait(100);
    let attackWorkflow = await MidiQOL.completeItemUse(weapon, config, options);
    if (!attackWorkflow) return;
    if (!attackWorkflow.hitTargets.size) return;
    let targets = mba.findNearby(workflow.targets.first(), 5, 'ally', true, false);
    if (!targets.length) return;
    let target;
    if (targets.length === 1) target = targets[0];
    if (!target) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, targets, true, 'one', false, false, 'Where does the fire leap?');
        if (!selection.buttons) return;
        let targetUUid = selection.inputs.find(i => i);
        if (!targetUUid) return;
        target = await fromUuid(targetUUid);
    }
    if (!target) return;

    new Sequence()

        .effect()
        .file("jb2a.fire_jet.green")
        .delay(500)
        .atLocation(workflow.targets.first())
        .rotateTowards(target)
        .scaleToObject(2)

        .effect()
        .file("jb2a.flames.orange.03.1x1.0")
        .delay(800)
        .attachTo(target, { offset: { x: 0, y: -0.15 }, gridUnits: true })
        .filter("ColorMatrix", { hue: 100 })
        .scaleToObject(1.4)
        .belowTokens(false)
        .opacity(0.8)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()

        .play();

    let modifier = mba.getSpellMod(workflow.item);
    let damageType = "fire";
    let damageFormula = level > 4 ? diceNumber + 'd8[' + damageType + '] + ' + modifier : modifier + '[' + damageType + ']';
    if (workflow.isCritical && !ignoreCrit) damageFormula = mba.getCriticalFormula(damageFormula);
    let damageRoll = await new CONFIG.Dice.DamageRoll(damageFormula, workflow.actor.getRollData(), options).evaluate();
    await mba.applyWorkflowDamage(workflow.token, damageRoll, 'fire', [target], workflow.item.name, attackWorkflow.itemCardId);
}