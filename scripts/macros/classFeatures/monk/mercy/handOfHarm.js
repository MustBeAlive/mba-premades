import { constants } from "../../../generic/constants.js";
import { mba } from "../../../../helperFunctions.js";
import { queue } from "../../../mechanics/queue.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (workflow.hitTargets.size != 1 || workflow.item?.system?.actionType != 'mwak' || workflow.item.name != "Unarmed Strike (Monk)") return;
    let target = workflow.targets.first();
    let originFeature = mba.getItem(workflow.actor, "Hand of Harm");
    if (!originFeature) return;
    if (!mba.perTurnCheck(originFeature, "feature", "handOfHarm")) return;
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    let free = await mba.findEffect(workflow.actor, "Flurry of Blows: Hand of Harm")
    if (!free) {
        if (kiPoints < 1) {
            ui.notifications.info("Not enough Ki Points!");
            return;
        }
    }
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'handOfHarm', 215);
    if (!queueSetup) return;
    await mba.playerDialogMessage();
    let selection = await mba.dialog(originFeature.name, constants.yesNo, `Use <b>${originFeature.name}</b>?`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    await mba.setTurnCheck(originFeature, "feature", "handOfHarm");
    let wisMod = workflow.actor.system.abilities.wis.mod;
    let monkDice = 4;
    if (monkLevel >= 5 && monkLevel < 11) monkDice = 6;
    else if (monkLevel >= 12 && monkLevel < 17) monkDice = 8;
    else if (monkLevel >= 17) monkDice = 10;
    let bonusDamageFormula = `1d${monkDice}[necrotic] + ${wisMod}[necrotic]`;
    let oldFormula = workflow.damageRoll._formula;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let physicianTouch = false
    if (monkLevel >= 6) physicianTouch = true;
    if (physicianTouch && !mba.checkTrait(target.actor, "ci", "poisoned")/*&& !mba.findEffect(target.actor, "Hand of Harm: Poison")*/) {
        await mba.playerDialogMessage();
        let poisonCheck = await mba.dialog("Hand of Harm: Poison", constants.okCancel, `Would you like to poison <u>${target.document.name}</u>?`);
        await mba.clearPlayerDialogMessage();
        if (poisonCheck) {
            let effectDataPoison = {
                'name': "Hand of Harm: Poison",
                'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
                'origin': workflow.item.uuid,
                'description': `
                    <p>You are poisoned until the end of ${workflow.token.document.name}'s next turn.</p>
                `,
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Poisoned",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                        'specialDuration': ['turnEndSource']
                    }
                }
            };
            await mba.createEffect(target.actor, effectDataPoison);
        }
    }
    if (!free) await kiItem.update({ "system.uses.value": kiPoints -= 1 });
    else await mba.removeEffect(free);
    queue.remove(workflow.item.uuid);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feature.handOfHarm.turn', '');
}

export let handOfHarm = {
    'attack': attack,
    'combatEnd': combatEnd
}