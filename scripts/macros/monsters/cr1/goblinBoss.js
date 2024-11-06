import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function redirectAttack(workflow) {
    let goblin = workflow.targets.first();
    if (!goblin) return;
    if (goblin.document.name != "Goblin Boss") return;
    if (mba.findEffect(goblin.actor, "Reaction")) {
        return;
    }
    let nearbyGoblins = Array.from(mba.findNearby(goblin, 5, "ally", false, false).filter(t => t.document.name.includes("Goblin")));
    if (!nearbyGoblins.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'redirectAttack', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Goblin Boss: Redirect Attack", constants.yesNo, mba.firstOwner(goblin).id, `<b>Use Redirect Attack?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.remoteSelectTarget(mba.firstOwner(goblin).id, "Redirect Attack", constants.okCancel, nearbyGoblins, false, "one", undefined, false, "Select target to reflect the spell at:");
    await mba.clearGMDialogMessage();
    if (!selection.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let [newTargetId] = selection.inputs.filter(i => i).slice(0);
    let newTargetDoc = canvas.scene.tokens.get(newTargetId);
    let newTarget = newTargetDoc.object;
    new Sequence()

        .animation()
        .on(goblin)
        .moveTowards(newTarget)
        .snapToGrid()

        .animation()
        .on(newTarget)
        .moveTowards(goblin)
        .snapToGrid()

        .thenDo(async () => {
            let feature = await mba.getItem(goblin.actor, "Redirect Attack");
            if (feature) await feature.displayCard();
            workflow.targets.delete(goblin);
            workflow.targets.add(newTarget);
            await mba.addCondition(goblin.actor, "Reaction");
            queue.remove(workflow.item.uuid);
        })

        .play()
}

export let goblinBoss = {
    'redirectAttack': redirectAttack
}