import {mba} from "../../../helperFunctions.js";

export async function createOrDestroyWater({ speaker, actor, token, character, item, args, scope, workflow }) {
    let level = workflow.castData.castLevel;
    let choices = [
        ["Create water", "create"],
        ["Destroy water", "destroy"],
        ["Cancel", "cancel"]
    ];
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Create or Destroy Water", choices, `<b>What would you like to do?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "create") {
        let ammount = 10 * level;
        ui.notifications.info(`You create ${ammount} gallons of water`);
    };
    if (selection === "destroy") {
        let size = (5 + level) * 5;
        ui.notifications.info(`You create ${size} ft. cube of water`);
    }

    new Sequence()

        .effect()
        .file("jb2a.cast_generic.water.02.blue.0")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.water.ball")
        .attachTo(workflow.token)
        .scaleToObject(1 * workflow.token.document.texture.scaleX)
        .playbackRate(0.85)

        .play()
}