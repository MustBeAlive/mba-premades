import {mba} from "../../../helperFunctions.js";

export async function findTraps({ speaker, actor, token, character, item, args, scope, workflow }) {
    let location = {
        x: workflow.token.center.x,
        y: workflow.token.center.y
    }
    new Sequence()
        
        .wait(1000)

        //First Wave

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(0)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(90)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(180)
        .name(`left`)
        
        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(270)
        .name(`top`)

        //Second Wave

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(45)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(135)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(225)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.greenorange")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(315)
        .name(`top`)

        .play()

    let choices = [[`Yes, there are traps in the vicinity`, "yes"],["No, there are no traps around", "no"]];
    await mba.gmDialogMessage();
    let selection = await mba.remoteDialog("Find Traps", choices, game.users.activeGM.id, `
        <p><b>${workflow.token.document.name} is looking for traps</b></p>
        <p>(line of sight inside 120 ft. range)</p>
        <p>A trap, for the purpose of this spell, includes <b>anything that would inflict a sudden or unexpected effect you consider harmful or undesirable</b>, which was specifically intended as such by its creator.</p>
        <p>Thus, the spell would sense an area affected by the <b>Alarm spell, a Glyph of Warding, or a mechanical pit trap</b>, but it <b>would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole</b>.</p>
    `);
    await mba.clearGMDialogMessage();
    if (!selection) return;
    else if (selection === "yes") {
        await mba.dialog("Find Traps", [["Ok", "ok"]], "<b>You sense traps nearby!</b>");
    }
    else if (selection === "no") {
        await mba.dialog("Find Traps", [["Ok", "ok"]], "<b>You don't sense any traps nearby!</b>");
    }
}