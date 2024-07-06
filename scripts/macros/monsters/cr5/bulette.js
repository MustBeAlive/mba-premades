import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function deadlyLeap({ speaker, actor, token, character, item, args, scope, workflow }) {
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await mba.aimCrosshair(workflow.token, 30, icon, interval, workflow.token.document.width);
    if (position.cancelled) return;

    await new Sequence()

        .canvasPan()
        .delay(100)
        .shake({ duration: 500, strength: 2, rotation: true, fadeOut: 500 })

        .effect()
        .file("jb2a.impact.ground_crack.01.white")
        .atLocation(workflow.token)
        .scale(0.3)
        .startTime(300)
        .randomRotation()
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.smoke.53")
        .spriteOffset({ x: -3.6, y: -3 }, { gridUnits: true })
        .atLocation(workflow.token)
        .rotateTowards(position)
        .rotate(90)
        .scale(0.9)
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.smoke.57")
        .atLocation(workflow.token)
        .randomRotation()
        .belowTokens()
        .scale(0.4)

        .animation()
        .on(workflow.token)
        .opacity(0)

        .effect()
        .from(workflow.token)
        .scaleOut(3, 1500, { ease: "easeOutQuint" })
        .fadeOut(800, { ease: "easeOutQuint" })
        .animateProperty("sprite", "position.x", { from: 0, to: 1, duration: 1250, gridUnits: true, ease: "easeOutQuint" })
        .waitUntilFinished()

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()

        .effect()
        .from(workflow.token)
        .atLocation(position)
        .scaleIn(3, 1200, { ease: "easeInCubic" })
        .fadeIn(600, { ease: "easeInCubic" })
        .animateProperty("sprite", "position.x", { from: 3, to: -0.5, duration: 1250, gridUnits: true, ease: "easeInCubic" })
        .waitUntilFinished(-50)

        .effect()
        .file("animated-spell-effects-cartoon.explosions.07")
        .randomRotation()
        .atLocation(position)
        .belowTokens()

        .effect()
        .file("jb2a.impact.ground_crack.01.white")
        .startTime(300)
        .randomRotation()
        .atLocation(position)
        .belowTokens()

        .canvasPan()
        .delay(100)
        .shake({ duration: 1200, strength: 3, rotation: true, fadeOut: 500 })

        .animation()
        .on(workflow.token)
        .delay(50)
        .opacity(1)

        .play();

    let targetUuids = await mba.findNearby(workflow.token, 3, null, true, false).map(t => t.document.uuid);
    if (!targetUuids.length) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Bulette: Deadly Leap", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    for (let target of Array.from(featureWorkflow.saves)) await mba.pushToken(workflow.token, target, 5);
    for (let target of Array.from(featureWorkflow.failedSaves)) {
        if (!mba.findEffect(target.actor, "Prone") && !mba.checkTrait(target.actor, "ci", "prone")) await mba.addCondition(target.actor, "Prone");
    }
}

export let bulette = {
    'deadlyLeap': deadlyLeap
}