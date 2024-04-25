export async function mistyStep({ speaker, actor, token, character, item, args, scope, workflow }) {
    let randomColor = false;
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
        let selection = await chrisPremades.helpers.dialog("Select color:", colors);
        if (!selection) return;
        animation1 = "jb2a.misty_step.01." + selection;
        animation2 = "jb2a.misty_step.02." + selection;
    }
    let maxRange = 30;
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await chrisPremades.helpers.aimCrosshair(workflow.token, maxRange, icon, interval, workflow.token.document.width);
    if (position.cancelled) return;

    new Sequence()

        .animation()
        .delay(800)
        .on(token)
        .fadeOut(200)

        .effect()
        .file(animation1)
        .atLocation(token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file(animation2)
        .atLocation(token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(token)
        .fadeIn(200)

        .play();
}