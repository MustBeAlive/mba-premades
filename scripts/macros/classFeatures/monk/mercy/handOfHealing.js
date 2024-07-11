import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";

export async function handOfHealing(workflow) {
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    let free = await mba.findEffect(workflow.actor, "Flurry of Blows: Hand of Healing")
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
    let targets = await mba.findNearby(workflow.token, 5, 'ally', true);
    if (!targets.length) {
        ui.notifications.warn("Unable to find allies nearby!");
        return;
    }
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget("Hand of Healing", constants.okCancel, targets, true, "one", null, false, "Choose ally to heal:");
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let target = fromUuidSync(selection.inputs[0]).object;
    let monkDice = 4;
    if (monkLevel >= 5 && monkLevel < 11) monkDice = 6;
    else if (monkLevel >= 12 && monkLevel < 17) monkDice = 8;
    else if (monkLevel >= 17) monkDice = 10;
    let wisMod = workflow.actor.system.abilities.wis.mod;
    let formula = `1d${monkDice} + ${wisMod}`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);
    let physicianTouch = false
    let effectToRemove;
    if (monkLevel >= 6) physicianTouch = true;
    if (physicianTouch) {
        let effects = target.actor.effects.filter(e => e.name === "Blinded" || e.name === "Deafened" || e.name === "Paralyzed" || e.name === "Poisoned" || e.name === "Stunned");
        if (effects.length) {
            await mba.playerDialogMessage();
            effectToRemove = await mba.selectEffect("Hand of Healing: Remove Condiion", effects, "Choose condition to remove:");
            await mba.clearPlayerDialogMessage();
        }
    }

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(target)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(target)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            if (!free) await kiItem.update({ "system.uses.value": kiPoints -= 1 });
            else await mba.removeEffect(free);
            if (physicianTouch && effectToRemove) await mba.removeEffect(effectToRemove); 
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
        })

        .play()
}