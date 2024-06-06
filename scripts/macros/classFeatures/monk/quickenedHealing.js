import {mba} from "../../../helperFunctions.js";

export async function quickenedHealing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 2) {
        ui.notifications.info("Not enough Ki Points!");
        return;
    }
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let monkDice = 4;
    if (monkLevel >= 5 && monkLevel < 11) monkDice = 6;
    else if (monkLevel >= 12 && monkLevel < 17) monkDice = 8;
    else if (monkLevel >= 17) monkDice = 10;
    let prof = workflow.actor.system.attributes.prof;
    let formula = `1d${monkDice} + ${prof}`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll, 'damageRoll');

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(token)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            await kiItem.update({ "system.uses.value": kiPoints -= 2 });
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], workflow.item.name, workflow.itemCardId);
        })

        .play()
}