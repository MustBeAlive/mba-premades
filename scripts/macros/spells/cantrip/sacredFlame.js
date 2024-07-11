import {mba} from "../../../helperFunctions.js";

export async function sacredFlame({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    let animation = "selection"; // "default"; "selection"; "random";
    if (!workflow.failedSaves.size) animation = "default";
    let animation1 = "jb2a.sacred_flame.source.";
    let animation2 = "jb2a.divine_smite.caster.";
    let animation3 = "jb2a.sacred_flame.target.";
    let color;
    let hue = 0;
    let choices = [
        ["Blue", "blue"],
        ["Green", "green"],
        ["Purple", "purple"],
        ["Yellow", "yellow"],
        ["White", "white"]
    ];
    if (animation === "default") color = "white";
    else if (animation === "selection") {
        await mba.playerDialogMessage();
        color = await mba.dialog("Sacred Flame", choices, `<b>Choose color:</b>`);
        await mba.clearPlayerDialogMessage();
        if (!color) color = "white";
    }
    else if (animation === "random") {
        let animRoll = await new Roll('1d4').roll({ 'async': true });
        color = choices[animRoll.total - 1][1];
    }
    if (!color) return;
    if (color === "blue") {
        animation1 += "blue";
        animation2 += "greenyellow";
        hue = 120;
        animation3 += "blue"; 
    }
    else if (color === "green") {
        animation1 += "green";
        animation2 += "greenyellow";
        animation3 += "green";
    }
    else if (color === "purple") {
        animation1 += "purple";
        animation2 += "purplepink";
        animation3 += "purple";
    }
    else if (color === "yellow") {
        animation1 += "yellow";
        animation2 += "blueyellow";
        animation3 += "yellow";
    }
    else if (color === "white") {
        animation1 += "white";
        animation2 += "yellowwhite";
        animation3 += "white";
    }

    new Sequence()

        .effect()
        .file(animation1)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .zIndex(1)

        .effect()
        .file(animation2)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .zIndex(3)
        .filter("ColorMatrix", { hue: hue})

        .effect()
        .file(animation3)
        .delay(2000)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .zIndex(2)
        .fadeIn(500)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .play()
}