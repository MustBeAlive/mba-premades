import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

export async function songOfRest({ speaker, actor, token, character, item, args, scope, workflow }) {
    let validTargets = [];
    let messages = Array.from(game.messages);
    for (let i of messages) {
        if (i.flavor != "Roll Hit Dice") continue;
        let tokenDoc = canvas.scene.tokens.get(i.speaker.token);
        if (validTargets.includes(tokenDoc)) continue;
        validTargets.push(tokenDoc);
    }
    if (!validTargets.length) {
        ui.notifications.warn("Unable to find hit die rolls in the chat!");
        return;
    }
    let targets = [];
    for (let i of validTargets) targets.push(i.object);
    let targetNames = "";
    for (let t of targets) targetNames += `<b>${t.document.name}</b>  `;
    await mba.gmDialogMessage();
    let check = await mba.remoteDialog("Song of Rest", constants.yesNo, game.users.activeGM.id, `<b>${workflow.token.document.name}</b> wants to use Song of Rest<br>Targets: ${targetNames}`);
    await mba.clearGMDialogMessage();
    if (!check) {
        ui.notifications.info("GM denied your request");
        return;
    }
    let bardLevel = workflow.actor.classes.bard?.system?.levels;
    if (!bardLevel) {
        ui.notifications.warn("Actor has no Bard levels!");
        return;
    }
    let ammount = 6;
    if (bardLevel >= 9 && bardLevel < 13) ammount = 8;
    else if (bardLevel >= 13 && bardLevel < 17) ammount = 10;
    else if (bardLevel >= 17) ammount = 12;
    let formula = `1d${ammount}[healing]`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });

    new Sequence()

        .effect()
        .file("jb2a.markers.music.pink")
        .attachTo(workflow.token)
        .scaleToObject(1.2)
        .filter("ColorMatrix", { hue: 180 })
        .fadeIn(1000)
        .fadeOut(1000)

        .play()

    for (let target of targets) {
        new Sequence()

            .wait(500)

            .effect()
            .file("jb2a.healing_generic.03.burst.green")
            .attachTo(target)
            .scaleToObject(2)
            .waitUntilFinished(-1233)

            .effect()
            .file("jb2a.healing_generic.burst.yellowwhite")
            .attachTo(target)
            .scaleToObject(1.35)
            .filter("ColorMatrix", { hue: 80 })
            .playbackRate(0.9)

            .play()
    }

    await warpgate.wait(1750);
    await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", targets, undefined, workflow.itemCardId);
}