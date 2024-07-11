import {mba} from "../../helperFunctions.js";

export async function telekinetic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let distance = 5;
    let choices = [["Push target 5 feet away", 5], ["Pull target 5 feet closer", -5]];
    if (workflow.failedSaves.size) {
        await mba.playerDialogMessage();
        distance = await mba.dialog("Telekinetic", choices, `<b>What would you like to do?</b>`);
        await mba.clearPlayerDialogMessage();
    }

    new Sequence()

        .effect()
        .file("jb2a.energy_beam.normal.purple.01")
        .attachTo(workflow.token)
        .stretchTo(target)
        .duration(2000)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .playbackRate(0.8)
        .waitUntilFinished(-1300)

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.pushToken(workflow.token, target, distance);
        })

        .play()
}