import {mba} from "../../helperFunctions.js";

export async function telekinetic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let distance = 5;
    if (workflow.failedSaves.size) distance = await mba.dialog("Telekinetic", [["Push target away", 5], ["Pull target closer", -5]], `<b>What would you like to do?</b>`);

    new Sequence()

        .effect()
        .file("jb2a.energy_beam.normal.purple.01")
        .attachTo(token)
        .stretchTo(target)
        .duration(2000)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutExpo" })
        .playbackRate(0.8)
        .waitUntilFinished(-1300)

        .thenDo(function () {
            if (workflow.failedSaves.size) mba.pushToken(workflow.token, target, distance)
        })

        .play()
}