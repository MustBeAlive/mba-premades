import {mba} from "../../../../helperFunctions.js";

export async function wholenessOfBody({ speaker, actor, token, character, item, args, scope, workflow }) {
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let formula = `3 * ${monkLevel}`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);

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
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], undefined, workflow.itemCardId);
        })

        .play()
}