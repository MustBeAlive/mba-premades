import {mba} from "../../../helperFunctions.js";

export async function lesserRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    await mba.playerDialogMessage(game.user);
    let resorationType = await mba.dialog("Lesser Restoration: Type", [["Condition", "condition"], ["Disease", "disease"]], `<b>Choose type of effect to remove:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!resorationType) return;
    if (resorationType === "condition") {
        let conditions = [
            ["Blindned", "blindness", "modules/mba-premades/icons/conditions/blinded.webp"],
            ["Deafened", "deafness", "modules/mba-premades/icons/conditions/deafened.webp"],
            ["Paralyzed", "paralyzed", "modules/mba-premades/icons/conditions/paralyzed.webp"],
            ["Poisoned", "poisoned", "modules/mba-premades/icons/conditions/poisoned.webp"],
            ["Level of Exhaustion", "exhaustion", "modules/mba-premades/icons/conditions/exhausted.webp"]
        ];
        let effect;
        await mba.playerDialogMessage(game.user);
        let conditionType = await mba.selectImage("Lesser Restoration: Condition", conditions, `<b>Which condition would you like to remove?</b>`, "value");
        await mba.clearPlayerDialogMessage();
        if (!conditionType) return;
        switch (conditionType) {
            case "blindness": {
                effect = await mba.findEffect(target.actor, "Blinded");
                if (!effect) {
                    ui.notifications.warn("Target is not blinded!");
                    return;
                }
                await mba.removeEffect(effect);
                break;
            }
            case "deafness": {
                effect = await mba.findEffect(target.actor, "Deafened");
                if (!effect) {
                    ui.notifications.warn("Target is not deafened!");
                    return;
                }
                await mba.removeEffect(effect);
                break;
            }
            case "paralyzed": {
                effect = await mba.findEffect(target.actor, "Paralyzed");
                if (!effect) {
                    ui.notifications.warn("Target is not paralyzed!");
                    return;
                }
                await mba.removeEffect(effect);
                break;
            }
            case "poisoned": {
                let effectsFirst = target.actor.effects.filter(i => i.name.includes("Poison"));
                if (!effectsFirst.length) {
                    ui.notifications.warn("Target is not poisoned!");
                    return;
                }
                if (effectsFirst.length < 2) {
                    let poison = await mba.findEffect(target.actor, effectsFirst[0].name);
                    if (!poison) {
                        ui.notifications.warn(`Unable to find Poison: ${effectsFirst[0].name}`);
                        return;
                    }
                    await mba.removeEffect(poison);
                }
                else {
                    let effects = effectsFirst.filter(i => i.name != "Poisoned");
                    if (effects.length < 2) {
                        let poison = await mba.findEffect(target.actor, effects[0].name);
                        if (!poison) {
                            ui.notifications.warn(`Unable to find Poison: ${effects[0].name}`);
                            return;
                        }
                        await mba.removeEffect(poison);
                    } else {
                        await mba.playerDialogMessage(game.user);
                        let effectToRemove = await mba.selectEffect("Lesser Restoration: Poison", effects, "<b>Choose one effect:</b>", false);
                        await mba.clearPlayerDialogMessage();
                        if (!effectToRemove) return;
                        await mba.removeEffect(effectToRemove);
                    }
                }
                break;
            }
            case "exhaustion": {
                let exhaustion = target.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                if (!exhaustion) {
                    ui.notifications.warn("Target has no levels of Exhaustion!");
                    return;
                }
                let level = +exhaustion.name.slice(-1);
                if (level === 0) level = 10;
                if (level === 1) {
                    await mba.removeCondition(target.actor, "Exhaustion 1");
                    break;
                }
                await mba.removeCondition(target.actor, `Exhaustion ${level}`);
                await mba.addCondition(target.actor, `Exhaustion ${level - 1}`);
                break
            }
        }
    }
    else if (resorationType === "disease") {
        let curable = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true && e.flags['mba-premades']?.lesserRestoration === true);
        if (!curable.length) {
            let uncurable = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true && !e.flags['mba-premades']?.lesserRestoration === true);
            if (!uncurable.length) {
                ui.notifications.warn("Target is not affected by any disease!");
                return;
            }
            ui.notifications.warn("Targeted creature is affected by a disease which can not be cured with Lesser Restoration!");
            return;
        }
        await mba.playerDialogMessage(game.user);
        const [diseaseEffect] = await new Promise(async (resolve) => {
            let content = "<center><b>Choose disease to remove:</b></center>";
            let buttons = {},
                dialog;
            for (let i of curable) {
                buttons[i.name] = {
                    label: `<img src='${i.icon}' width='50' height='50' style='border: 0px; float: left'><p style='padding: 1%; font-size: 15px'> ${i.flags['mba-premades']?.name} </p>`,
                    callback: () => resolve([i])
                }
            }
            let height = (Object.keys(buttons).length * 66 + 56);
            if (Object.keys(buttons).length > 14) height = 850;
            dialog = new Dialog(
                {
                    title: "Lesser Restoration: Cure Disease",
                    content: content,
                    buttons,
                    close: () => resolve(false)
                },
                {
                    height: height
                }
            );
            await dialog._render(true);
            dialog.element.find(".dialog-buttons").css({
                "flex-direction": 'column',
            })
        });
        await mba.clearPlayerDialogMessage();
        if (!diseaseEffect) return;
        await mba.removeEffect(diseaseEffect);
    }

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.green")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.bluewhite")
        .atLocation(target)
        .scaleToObject(1.5)
        .filter("ColorMatrix", { hue: 275 })
        .fadeOut(1000, { ease: "easeInExpo" })
        .belowTokens()
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .duration(1200)
        .attachTo(target, { bindAlpha: false })

        .effect()
        .from(target)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .fadeIn(100)
        .opacity(1)
        .fadeOut(5000)
        .duration(6000)
        .attachTo(target)

        .effect()
        .file("jb2a.fireflies.few.02.green")
        .atLocation(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .attachTo(target)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(target)
        .fadeIn(200)
        .opacity(0.25)
        .duration(10000)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.03")
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .fadeIn(200, { ease: "easeInExpo" })
        .duration(10000)
        .opacity(0.25)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .play()
}   