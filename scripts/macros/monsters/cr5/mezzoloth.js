import {mba} from "../../../helperFunctions.js";

async function teleport({ speaker, actor, token, character, item, args, scope, workflow }) {
    let randomColor = true;
    let colors = [
        ["Blue", "blue"],
        ["Black", "dark_black"],
        ["Dark Green", "dark_green"],
        ["Dark Red", "dark_red"],
        ["Green", "green"],
        ["Grey", "grey"],
        ["Orange", "orange"],
        ["Pink", "pink"],
        ["Purple", "purple"],
        ["Red", "red"],
        ["Yellow", "yellow"]
    ];
    let animRoll1 = await new Roll('1d11').roll({ 'async': true });
    let animRoll2 = await new Roll('1d11').roll({ 'async': true });
    let animation1 = "jb2a.misty_step.01." + colors[(animRoll1.total - 1)][1];
    let animation2 = "jb2a.misty_step.02." + colors[(animRoll2.total - 1)][1];
    if (randomColor === false) {
        let selection = await mba.dialog("Teleport", colors, "<b>Select color:</b>");
        if (!selection) return;
        animation1 = "jb2a.misty_step.01." + selection;
        animation2 = "jb2a.misty_step.02." + selection;
    }
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await mba.aimCrosshair(workflow.token, 60, workflow.item.img, interval, workflow.token.document.width);
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

export let mezzoloth = {
    'teleport': teleport
}