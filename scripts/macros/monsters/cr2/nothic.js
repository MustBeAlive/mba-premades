import {mba} from "../../../helperFunctions.js";

async function rottingGaze({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
        .atLocation(workflow.token)
        .size(0.9, { gridUnits: true })
        .duration(6000)
        .fadeIn(200)
        .fadeOut(500)
        .anchor({ x: 0.5, y: 0.5 })

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
        .atLocation(workflow.token)
        .size(0.9, { gridUnits: true })
        .duration(6000)
        .fadeIn(200)
        .fadeOut(500)
        .anchor({ x: 0.5, y: 0.5 })
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })


        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(workflow.token)
        .size(3, { gridUnits: true })
        .duration(5000)
        .fadeIn(1000)
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .scale({ x: 0.1, y: 1.25 })
        .anchor({ x: 0.5, y: 0.35 })
        .opacity(0.5)
        .rotate(90)
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scale({ x: 0.1, y: 1.25 })
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .anchor({ x: 0.5, y: 0.35 })
        .opacity(0.2)
        .rotate(90)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .effect()
        .file("jb2a.wind_stream.white")
        .atLocation(workflow.token)
        .stretchTo(target, { onlyX: false })
        .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 100, pingPong: true })
        .opacity(0.3)
        .filter("Blur", { blurX: 10, blurY: 20 })

        .effect()
        .from(target)
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .fadeIn(100)
        .fadeOut(1000)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
        .playbackRate(4)
        .opacity(0.15)
        .zIndex(0.1)

        .play()
}

async function weirdInsight({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "charmed")) {
        ui.notifications.warn("Target is immune to Weird Insight!");
        return;
    }
    let targetRoll = await mba.rollRequest(target, "skill", "dec");
    let sourceRoll = await workflow.actor.rollSkill("ins");
    if (targetRoll.total >= sourceRoll.total) return;
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.blue.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .thenDo(async () => {
            ChatMessage.create({
				flavor: `Learns one fact or secret about <u>${target.document.name}</u>!`,
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
        })

        .play()
}

export let nothic = {
    'rottingGaze': rottingGaze,
    'weirdInsight': weirdInsight
}