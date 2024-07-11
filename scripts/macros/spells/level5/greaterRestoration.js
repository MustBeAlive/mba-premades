import {mba} from "../../../helperFunctions.js";

export async function greaterRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices = [
        ['Charmed', 'charm'],
        ['Petrified', 'petr'],
        ['Cursed', 'curse'],
        ['Ability Score Reduction', 'ability'],
        ['Hit Point Maximum Reduction', 'health'],
        ['Up to 3 levels of Exhaustion', 'exhaustion'] //HB
    ];
    await mba.playerDialogMessage();
    let selection = await mba.dialog('Greater Restoration', choices, "<b>Which condition do you wish to remove?</b>");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "charm") {
        let effectToRemove = await mba.findEffect(target.actor, "Charmed");
        if (!effectToRemove) {
            ui.notifications.warn("Target is not charmed!");
            return;
        }
        await mba.removeEffect(effectToRemove);
    }
    else if (selection === "petr") {
        let effectsFirst = target.actor.effects.filter(i => i.name.includes("Petrif"));
        if (!effectsFirst.length) {
            ui.notifications.warn("Target is not petrified!");
            return;
        }
        let effectToRemove;
        if (effectsFirst.length < 2) {
            effectToRemove = await mba.findEffect(target.actor, effectsFirst[0].name);
            if (!effectToRemove) {
                ui.notifications.warn(`Unable to find Poison: ${effectsFirst[0].name}`);
                return;
            }
            await mba.removeEffect(effectToRemove);
        }
        else {
            let effects = effectsFirst.filter(i => i.name != "Petrified");
            if (effects.length < 2) {
                effectToRemove = await mba.findEffect(target.actor, effects[0].name);
                if (!effectToRemove) {
                    ui.notifications.warn(`Unable to find Poison: ${effects[0].name}`);
                    return;
                }
                await mba.removeEffect(effectToRemove);
            } else {
                await mba.playerDialogMessage();
                effectToRemove = await mba.selectEffect("Greater Restoration: Petrification", effects, "<b>Choose one effect:</b>");
                await mba.clearPlayerDialogMessage();
                if (!effectToRemove) return;
                await mba.removeEffect(effectToRemove);
            }
        }
    }
    else if (selection === "curse") {
        let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isCurse === true && e.flags['mba-premades']?.greaterRestoration === true);
        if (!effects.length) {
            let uncurable = target.actor.effects.filter(e => e.flags['mba-premades']?.isCurse === true && !e.flags['mba-premades']?.greaterRestoration === true);
            if (!uncurable.length) {
                ui.notifications.info('Target is not affected by any curse!');
                return;
            }
            ui.notifications.info('Targeted creature is affected by a curse which can not be removed with Greater Restoration!');
            return;
        }
        let effectToRemove;
        if (effects.length < 2) {
            effectToRemove = await mba.findEffect(target.actor, effects[0].name);
            if (!effectToRemove) {
                ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                return;
            }
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        }
        else {
            await mba.playerDialogMessage();
            effectToRemove = await mba.selectEffect("Greater Restoration: Curse", effects, "<b>Choose effect to remove:</b>");
            await mba.clearPlayerDialogMessage();
            if (!effectToRemove) return;
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        }
    }
    else if (selection === "ability") {
        let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.abilityReduction === true && e.flags['mba-premades']?.greaterRestoration === true);
        if (!effects.length) {
            ui.notifications.warn("Target is not affected by any ability reduction effects!");
            return;
        }
        let effectToRemove;
        if (effects.length < 2) {
            effectToRemove = await mba.findEffect(target.actor, effects[0].name);
            if (!effectToRemove) {
                ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                return;
            }
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        } 
        else {
            await mba.playerDialogMessage();
            effectToRemove = await mba.selectEffect("Greater Restoration: Ability Reduction", effects, "<b>Select effect to remove:</b>");
            await mba.clearPlayerDialogMessage();
            if (!effectToRemove) return;
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        }
    }
    else if (selection === "health") {
        let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.healthReduction === true && e.flags['mba-premades']?.greaterRestoration === true);
        if (!effects.length) {
            ui.notifications.warn("Target is not affected by any health reduction effects!");
            return;
        }
        let effectToRemove;
        if (effects.length < 2) {
            effectToRemove = await mba.findEffect(target.actor, effects[0].name);
            if (!effectToRemove) {
                ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                return;
            }
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        } 
        else {
            await mba.playerDialogMessage();
            effectToRemove = await mba.selectEffect("Greater Restoration: Heath Reduction", effects, "<b>Choose effect to remove:</b>");
            await mba.clearPlayerDialogMessage();
            if (!effectToRemove) return;
            let eventId = effectToRemove.flags['mba-premades']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effectToRemove);
        }
    }
    else if (selection === "exhaustion") {
        let exhaustion = target.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
        if (!exhaustion) {
            ui.notifications.warn("Target has no levels of Exhaustion!");
            return;
        }
        let exhaustName;
        let level = +exhaustion.name.slice(-1);
        if (level <= 3) {
            exhaustName = `Exhaustion ${level}`;
            let effect = await mba.findEffect(target.actor, exhaustName);
            if (effect) await mba.removeEffect(effect);
        }
        else {
            level -= 3;
            exhaustName = `Exhaustion ${level}`;
            await mba.addCondition(target.actor, exhaustName);
        }
    }

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.purple")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.purplepink")
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1.5)
        .duration(1200)
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .from(target)
        .attachTo(target)
        .duration(6000)
        .fadeIn(100)
        .fadeOut(5000)
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })

        .effect()
        .file("jb2a.fireflies.few.02.purple")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.purple.01.03")
        .attachTo(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .play()
}