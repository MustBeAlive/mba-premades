import {mba} from "../../../helperFunctions.js";

export async function lifeTransference({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let damageFormula = `${workflow.castData.castLevel + 1}d8[none]`;
    let damageRoll = await new Roll(damageFormula).roll({'async': true});
    await MidiQOL.displayDSNForRoll(damageRoll);
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: {alias: name},
        flavor: workflow.item.name
    });
    let healingRoll = await new Roll(`${damageRoll.total * 2}`).roll({'async': true});

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.necromancy.complete.green")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .fadeOut(1000)
        .belowTokens()
        .zIndex(0)

        .wait(2200)

        .thenDo(async () => {
            await mba.applyDamage(workflow.token, damageRoll.total, "none");
        })

        .effect()
        .file("jb2a.impact.010.green")
        .atLocation(workflow.token)
        .scaleToObject(1.3)
        .fadeOut(750)
        .zIndex(2)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(workflow.token)
        .scaleToObject(1.7 * workflow.token.document.texture.scaleX)
        .duration(7000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .zIndex(1)
        .belowTokens()

        .wait(500)

        .effect()
        .file("jb2a.twinkling_stars.points04.orange")
        .atLocation(workflow.token)
        .scaleToObject(0.75)
        .duration(7000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 4042, ease: "easeOutSine" })
        .rotate(0)
        .zIndex(3)
        .filter("ColorMatrix", { hue: 70 })

        .wait(500)

        .effect()
        .file("jb2a.energy_beam.normal.dark_greenpurple.03")
        .attachTo(workflow.token)
        .stretchTo(target)
        .duration(7000)
        .fadeOut(1000)
        .scaleIn(0, 2000)
        .playbackRate(0.8)
        .zIndex(4)

        .wait(1500)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], "Healing", workflow.itemCardId);
        })

        .play()
}