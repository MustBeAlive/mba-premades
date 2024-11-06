import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function focusedAim({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1 || workflow.isFumble) return;
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'focusedAim', 151);
    if (!queueSetup) return;
    let attackTotal = workflow.attackTotal;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.ac.value <= attackTotal) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let featureMenu = [['Yes: 1 Ki Point / +2 to hit', 2]];
    if (kiPoints >= 2) featureMenu.push(['Yes: 2 Ki Point / +4 to hit', 4]);
    if (kiPoints >= 3) featureMenu.push(['Yes: 3 Ki Point / +6 to hit', 6]);
    featureMenu.push(['No', false]);
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Focused Aim", featureMenu, `<p>Attack roll total: <b>${attackTotal} (missed)</b></p><p>Use Focused Aim? (Ki Points left: ${kiPoints})</p>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.ui.indicator.bluegreen.02.01")
        .attachTo(target)
        .scaleToObject(1.3 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(500)
        .playbackRate(0.8)
        .repeats(3, 1100)

        .thenDo(async () => {
            let updatedRoll = await mba.addToRoll(workflow.attackRoll, selection);
            await workflow.setAttackRoll(updatedRoll);
            await kiItem.update({ 'system.uses.value': kiPoints - (selection / 2) });
            let originItem = await mba.getItem(workflow.actor, 'Focused Aim');
            if (originItem) await originItem.use();
            queue.remove(workflow.item.uuid);
        })

        .play()
}