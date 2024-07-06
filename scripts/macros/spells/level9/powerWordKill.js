import {mba} from "../../../helperFunctions.js";

export async function powerWordKill({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let currentHP = target.actor.system.attributes.hp.value;
    let formula = currentHP.toString();
    let damageRoll = await new Roll(formula).roll({ 'async': true });

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .repeats(3, 1000, 1000)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(2.8)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .repeats(3, 1000, 1000)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(10500)
        .fadeIn(1000)
        .fadeOut(1000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.02.red")
        .attachTo(workflow.token, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .duration(9000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.06.red")
        .attachTo(workflow.token, { offset: { x: 0, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(1000)
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.02.red")
        .attachTo(workflow.token, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(2000)
        .duration(7000)
        .fadeIn(1000)
        .fadeOut(1000)
        .mirrorX()

        .wait(3500)

        .effect()
        .file("jb2a.cast_generic.dark.side01.red")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .size(1.5 * workflow.token.document.width, { gridUnits: true })
        .zIndex(2)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.impact.004.dark_red")
        .atLocation(target)
        .scaleToObject(3)
        .fadeOut(1167)
        .scaleIn(0, 1167, { ease: "easeOutCubic" })
        .opacity(0.45)

        .canvasPan()
        .shake({ duration: 100, strength: 25, rotation: false })

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .attachTo(target)
        .scaleToObject(1.25)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(1)
        .playbackRate(4)
        .randomRotation()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .repeats(15, 250, 250)

        .thenDo(async () => {
            if (currentHP < 100) {
                if (target.actor.type === "npc") {
                    await mba.applyWorkflowDamage(workflow.token, damageRoll, "none", [target], undefined, workflow.itemCardId);
                    return;
                }
                else {
                    await mba.applyWorkflowDamage(workflow.token, damageRoll, "none", [target], undefined, workflow.itemCardId);
                    await warpgate.wait(250);
                    if (mba.findEffect(target.actor, "Unconscious")) await mba.removeCondition(target.actor, 'Unconscious');
                    await mba.addCondition(target.actor, 'Dead', true);
                }
            }
            else ui.notifications.info("Target has more than 100 HP!");
        })

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.75 * target.document.texture.scaleX)
        .delay(100)
        .duration(4500)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()
        .playIf(() => {
            return currentHP < 100;
        })

        .play()
}