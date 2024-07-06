import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) === "plant") await mba.createEffect(target.actor, constants.disadvantageEffectData);

    new Sequence()

        .wait(750)

        .effect()
        .file(`jb2a.plant_growth.01.ring.4x4.complete.bluepurple`)
        .atLocation(workflow.token)
        .size(1.5, { gridUnits: true })
        .fadeOut(2000)
        .zIndex(0.1)
        .belowTokens()
        .filter("ColorMatrix", { hue: -60 })

        .effect()
        .file("jb2a.shield_themed.above.eldritch_web.01.dark_green")
        .atLocation(workflow.token)
        .scaleToObject(1.75)
        .duration(5500)
        .fadeIn(1500)
        .fadeOut(1000)
        .startTime(4900)
        .randomRotation()
        .opacity(0.5)
        .filter("Glow", { color: 0x54e399, knockout: true, distance: 1, outerStrength: 2 })
        .belowTokens()
        .noLoop()

        .effect()
        .file(`jb2a.plant_growth.01.ring.4x4.loop.bluepurple`)
        .atLocation(workflow.token)
        .size(1.5, { gridUnits: true })
        .delay(500)
        .duration(500)
        .fadeIn(200, { ease: "easeOutCirc" })
        .fadeOut(300, { ease: "linear" })
        .belowTokens()
        .zIndex(1)
        .playbackRate(2)
        .filter("ColorMatrix", { saturate: -1, hue: -60, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 5 })

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.03")
        .atLocation(workflow.token)
        .size(2, { gridUnits: true })
        .delay(500)
        .duration(3000)
        .fadeIn(500)
        .fadeOut(1000)
        .randomRotation()
        .filter("ColorMatrix", { saturate: 1, hue: 60 })
        .zIndex(4)

        .effect()
        .file("jb2a.fireflies.few.01.green")
        .atLocation(workflow.token)
        .size(1.5, { gridUnits: true })
        .delay(500)
        .duration(3000)
        .fadeIn(500)
        .fadeOut(1000)
        .randomRotation()
        .filter("ColorMatrix", { hue: 60 })
        .zIndex(5)

        .effect()
        .file("jb2a.cast_generic.ice.01.blue.0")
        .atLocation(workflow.token)
        .size(1.5, { gridUnits: true })
        .delay(750)
        .opacity(0.8)
        .zIndex(2)
        .playbackRate(2)
        .filter("ColorMatrix", { hue: -60 })
        .waitUntilFinished(-200)

        .effect()
        .file("jb2a.fireball.beam.dark_red")
        .atLocation(workflow.token)
        .stretchTo(target)
        .scale(0.3)
        .filter("ColorMatrix", { hue: -285 })
        .playbackRate(1.75)
        .startTime(2000)
        .waitUntilFinished(-2100)

        //Explosion

        .effect()
        .file("animated-spell-effects-cartoon.smoke.07")
        .attachTo(target)
        .size(2.25, { gridUnits: true })
        .tint("#54e399")
        .playbackRate(1)
        .opacity(0.6)
        .fadeOut(500)
        .zIndex(2)

        .effect()
        .file("jb2a.impact.dark.01.red.0")
        .attachTo(target)
        .size(2.5, { gridUnits: true })
        .filter("ColorMatrix", { hue: 150 })
        .randomizeMirrorX()
        .randomizeMirrorY()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .delay(250)
        .duration(4000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .belowTokens()
        .randomRotation()
        .zIndex(0.2)

        .effect()
        .file("jb2a.fireflies.few.02.green")
        .attachTo(target)
        .size(1.5, { gridUnits: true })
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomRotation()
        .zIndex(3)
        .filter("ColorMatrix", { hue: 60 })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .size(1.5, { gridUnits: true })
        .delay(250)
        .fadeOut(3000)
        .fadeOut(1000)
        .opacity(0.8)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .tint("#54e399")

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'blight', 50);
    if (!queueSetup) return;
    let creatureType = mba.raceOrType(workflow.targets.first().actor);
    let newDamageRoll = '';
    if (creatureType === 'plant') {
        let oldDamageRoll = workflow.damageRoll;
        for (let i = 0; oldDamageRoll.terms.length > i; i++) {
            let flavor = oldDamageRoll.terms[i].flavor;
            let isDeterministic = oldDamageRoll.terms[i].isDeterministic;
            if (isDeterministic === true) newDamageRoll += oldDamageRoll.terms[i].formula;
            else newDamageRoll += '(' + oldDamageRoll.terms[i].number + '*' + oldDamageRoll.terms[i].faces + ')[' + flavor + ']';
        }
    }
    else if (creatureType === "undead" || creatureType === "construct") newDamageRoll = `0[${workflow.defaultDamageType}]`;
    else {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageRoll = await mba.damageRoll(workflow, newDamageRoll, undefined, true);
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let blight = {
    'cast': cast,
    'item': item
}