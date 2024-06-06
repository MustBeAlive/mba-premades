import {mba} from "../../../helperFunctions.js";

export async function mistyStep({ speaker, actor, token, character, item, args, scope, workflow }) {
    let randomColor = false;
    let colors = [
        ["Black", "dark_black", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Dark_Black_Thumb.webp"],
        ["Blue", "blue", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Blue_Thumb.webp"],
        ["Green", "green", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Green_Thumb.webp"],
        ["Dark Green", "dark_green", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Dark_Green_Thumb.webp"],
        ["Grey", "grey", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Grey_Thumb.webp"],
        ["Orange", "orange", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Orange_Thumb.webp"],
        ["Pink", "pink", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Pink_Thumb.webp"],
        ["Purple", "purple", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Purple_Thumb.webp"],
        ["Dark Purple", "dark_purple", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Dark_Purple_Thumb.webp"],
        ["Red", "red", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Red_Thumb.webp"],
        ["Dark Red", "dark_red", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Dark_Red_Thumb.webp"],
        ["Yellow", "yellow", "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Yellow_Thumb.webp"]
    ];
    let animRoll1 = await new Roll('1d12').roll({ 'async': true });
    let animRoll2 = await new Roll('1d12').roll({ 'async': true });
    let animation1 = "jb2a.misty_step.01." + colors[(animRoll1.total - 1)][1];
    let animation2 = "jb2a.misty_step.02." + colors[(animRoll2.total - 1)][1];
    if (randomColor === false) {
        let selection = await mba.selectImage("Misty Step", colors, `<b>Choose Color:</b>`, "value");
        animation1 = "jb2a.misty_step.01." + selection;
        animation2 = "jb2a.misty_step.02." + selection;
        if (!selection) {
            animation1 = "jb2a.misty_step.01.blue";
            animation2 = "jb2a.misty_step.02.blue";
        }
    }
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await mba.aimCrosshair(workflow.token, 30, icon, interval, workflow.token.document.width);
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