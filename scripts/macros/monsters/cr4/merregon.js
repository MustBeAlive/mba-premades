import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function loyalBodyguard(workflow) {
    let currentTarget = workflow.targets.first();
    if (!workflow.hitTargets.size) return;
    if (mba.raceOrType(currentTarget) != "fiend") return;
    let [merregon] = await mba.findNearby(currentTarget, 5, "ally", false, false).filter(t => t.name === "Merregon");
    if (!merregon) return;
    if (mba.findEffect(merregon.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'loyalBodyguard', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Merregon: Loyal Bodyguard", constants.yesNo, mba.firstOwner(merregon).id, `<b>Use ability to redirect attack to you?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.ui.indicator.redyellow.02.01")
        .attachTo(merregon)
        .scaleToObject(1.25)
        .duration(5000)
        .fadeOut(500)
        .scaleIn(0.5, 300, { ease: "easeOutCubic" })
        .loopProperty("sprite", "position.x", { values: [-50, 50, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
        .loopProperty("sprite", "position.y", { values: [-100, 100, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
        .zIndex(1)

        .effect()
        .file("jb2a.token_stage.round.red.02.01")
        .attachTo(merregon)
        .scaleToObject(1.25)
        .delay(2000)
        .duration(5000)
        .fadeOut(2000)
        .opacity(0.75)

        .thenDo(async () => {
            let feature = await mba.getItem(merregon.actor, "Loyal Bodyguard");
            if (feature) await feature.displayCard();
            workflow.targets.delete(currentTarget);
            workflow.hitTargets.delete(currentTarget);
            workflow.targets.add(merregon);
            workflow.hitTargets.add(merregon);
            await mba.addCondition(merregon.actor, "Reaction");
            queue.remove(workflow.item.uuid);
        })

        .play()
}

export let merregon = {
    'loyalBodyguard': loyalBodyguard
}