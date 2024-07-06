import {mba} from "../../../helperFunctions.js";

// To do: charm

async function feyCharmCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = await mba.raceOrType(target.actor);
    if (type != "humanoid" || type != "beast") {
        ui.notifications.warn("Fey charm works only on beast and humanoid targets!");
        return false;
    }
}

async function feyCharmItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
}

async function treeStride({ speaker, actor, token, character, item, args, scope, workflow }) {
    let animation1 = "jb2a.misty_step.01.green";
    let animation2 = "jb2a.misty_step.02.green";
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await mba.aimCrosshair(workflow.token, 60, icon, interval, workflow.token.document.width);
    if (position.cancelled) return;

    new Sequence()

        .animation()
        .delay(800)
        .on(workflow.token)
        .fadeOut(200)

        .effect()
        .file(animation1)
        .atLocation(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file(animation2)
        .atLocation(workflow.token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(workflow.token)
        .fadeIn(200)

        .play();
}

export let dryad = {
    'feyCharmCheck': feyCharmCheck,
    'feyCharmItem': feyCharmItem,
    'treeStride': treeStride
}