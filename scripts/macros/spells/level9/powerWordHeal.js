import {mba} from "../../../helperFunctions.js";

export async function powerWordHeal({ speaker, actor, token, character, item, args, scope, workflow }) {
    await new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(2.8)
        .fadeIn(1000)
        .fadeOut(4000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .fadeIn(2000)
        .fadeOut(4000)
        .filter("ColorMatrix", { brightness: 1.5 })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.08.green")
        .attachTo(workflow.token, { offset: { x: -0.4, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .fadeIn(1000)
        .fadeOut(4000)
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .effect()
        .file("jb2a.magic_signs.rune.evocation.loop.green")
        .attachTo(workflow.token, { offset: { x: 0, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(1000)
        .fadeIn(1000)
        .fadeOut(4000)
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.08.green")
        .attachTo(workflow.token, { offset: { x: 0.4, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(4000)
        .mirrorX()
        .persist()
        .name(`${workflow.token.document.name} PWH`)

        .wait(3500)

        .play()

    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn("Power Word: Heal has no effect on undead and construct creatures!");
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} PWH` })
        return false;
    }
    let diff = target.actor.system.attributes.hp.max - target.actor.system.attributes.hp.value;
    let formula = diff.toString();
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    let isCharmed = await mba.findEffect(target.actor, 'Charmed');
    let isFrightened = await mba.findEffect(target.actor, 'Frightened');
    let isParalyzed = await mba.findEffect(target.actor, 'Paralyzed');
    let isStunned = await mba.findEffect(target.actor, 'Stunned');
    let reaction = mba.findEffect(target.actor, 'Reaction');

    new Sequence()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} PWH` })
        })

        .effect()
        .file("jb2a.healing_generic.burst.tealyellow")
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1.5)
        .duration(1200)
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .filter("ColorMatrix", { hue: 290 })

        .effect()
        .from(target)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .fadeIn(100)
        .opacity(1)
        .fadeOut(5000)
        .duration(6000)

        .effect()
        .file("jb2a.fireflies.few.02.green")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.03")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)
        .opacity(0.25)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} PWH` })
            if (isCharmed) await mba.removeCondition(target.actor, 'Charmed');
            if (isFrightened) await mba.removeCondition(target.actor, 'Frightened');
            if (isParalyzed) await mba.removeCondition(target.actor, 'Paralyzed');
            if (isStunned) await mba.removeCondition(target.actor, 'Stunned');
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
            if (reaction) return;
            let isProne = await mba.findEffect(target.actor, 'Prone');
            if (!isProne) return;
            async function effectMacroCreate() {
                let effect = mbaPremades.helpers.findEffect(actor, 'Power Word: Heal');
                let selection = await mbaPremades.helpers.dialog("Power Word Heal", mbaPremades.constants.yesNo, "<p>Do you wish to spend your reaction to stand up?</p>");
                if (!selection) {
                    await mbaPremades.helpers.removeEffect(effect);
                    return;
                }
                await mbaPremades.helpers.removeCondition(actor, 'Prone');
                await mbaPremades.helpers.addCondition(actor, 'Reaction');
                await mbaPremades.helpers.removeEffect(effect);
            }
            let effectData = {
                'name': 'Power Word: Heal',
                'flags': {
                    'effectmacro': {
                        'onCreate': {
                            'script': mba.functionToString(effectMacroCreate)
                        }
                    }
                }

            };
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}