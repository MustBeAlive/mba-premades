import {mba} from "../../../helperFunctions.js";

export async function stillnessOfMind({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [];
    let charmed = mba.findEffect(workflow.actor, 'Charmed');
    if (charmed) choices.push(["Charmed", 1])
    let frightened = mba.findEffect(workflow.actor, 'Frightened');
    if (frightened) choices.push(["Frightened", 2]);
    if (!choices.length) {
        ui.notifications.info("You are neither charmed nor frightened!");
        return;
    }
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Stillness of Mind", choices, "Choose condition to remove:");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    new Sequence()

        .effect()
        .file("jb2a.healing_generic.03.burst.bluepurple")
        .attachTo(token)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 320})

        .wait(1100)

        .thenDo(async () => {
            if (selection === 1) await mba.removeCondition(workflow.actor, 'Charmed');
            else if (selection === 2) await mba.removeCondition(workflow.actor, 'Frightened');
        })

        .play()
}