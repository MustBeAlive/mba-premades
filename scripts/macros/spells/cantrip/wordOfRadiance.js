import {mba} from "../../../helperFunctions.js";
import {constants} from "../../generic/constants.js";

export async function wordOfRadiance({ speaker, actor, token, character, item, args, scope, workflow }) {
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep:');
    if (selection.buttons === false) return;
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
    await warpgate.wait(100);
    new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.white.02.03`)
        .attachTo(workflow.token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .size(3, { gridUnits: true })
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.yellowwhite")
        .atLocation(workflow.token)
        .size(4.2, { gridUnits: true })
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .atLocation(workflow.token)
        .size(3.85, { gridUnits: true })
        .belowTokens()

        .play()

    for (let target of Array.from(game.user.targets)) {
        new Sequence()

            .wait(2000)

            .effect()
            .file("jb2a.impact.003.yellow")
            .attachTo(target)
            .size(2.5, { gridUnits: true })

            .play()
    }
}