import {mba} from "../../../helperFunctions.js";

export async function greaterRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let effect;
    let choices = [
        ['Charmed', 'charm'],
        ['Petrified', 'petr'],
        ['Cursed', 'curse'],
        ['Ability Score Reduction', 'ability'],
        ['Hit Point Maximum Reduction', 'health'],
        ['Up to 3 levels of Exhaustion', 'exhaustion']
    ];
    let selection = await mba.dialog('Greater Restoration', choices, "<b>Which condition do you wish to remove?</b>");
    if (!selection) return;
    if (selection === "charm") {
        effect = await mba.findEffect(target.actor, "Charmed");
        if (!effect) {
            ui.notifications.warn("Target is not charmed!");
            return;
        }
        await mba.removeEffect(effect);
    }
    else if (selection === "petr") {
        effect = await mba.findEffect(target.actor, "Petrified");
        if (!effect) {
            ui.notifications.warn("Target is not petrified!");
            return;
        }
        await mba.removeEffect(effect);
        let cockatrice = await mba.findEffect(target.actor, "Cockatrice: Petrification");
        let medusa = await mba.findEffect(target.actor, "Medusa: Petrification")
        if (medusa && cockatrice) {

        }
        if (cockatrice) await mba.removeEffect(cockatrice);
        if (medusa) await mba.removeEffect(medusa);
    }
    else if (selection === "curse") {
        let curable = target.actor.effects.filter(i => i.flags['mba-premades']?.isCurse === true).filter(i => i.flags['mba-premades']?.greaterRestoration === true);
        if (!curable.length) {
            let uncurable = target.actor.effects.filter(i => i.flags['mba-premades']?.isCurse === true).filter(i => !i.flags['mba-premades']?.greaterRestoration === true);
            if (!uncurable.length) {
                ui.notifications.info('Target is not affected by any curse!');
                return;
            }
            ui.notifications.info('Targeted creature is affected by a curse which can not be removed with Greater Restoration!');
            return;
        }
        effect = await mba.findEffect(target.actor, "Hexed");
        if (effect) await mba.removeEffect(effect);
    }
    else if (selection === "ability") {
        let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.abilityReduction === true);
        if (!effects.length) {
            ui.notifications.warn("Target is not affected by any ability reduction effects!");
            return;
        }
        if (effects.length < 2) {
            let effect = await mba.findEffect(target.actor, effects[0].name);
            if (!effect) {
                ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                return;
            }
            let eventId = effect.flags['mba-bestiary']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effect);
        } else {
            let selection = [];
            for (let i = 0; i < effects.length; i++) {
                let effect = effects[i];
                let name = effect.name;
                let icon = effect.icon;
                let penalty = effect.flags['mba-premades']?.penalty;
                selection.push([name, penalty, icon]);
            }
            function generateEnergyBox(type) {
                return `
                <label class="radio-label">
                <input type="radio" name="type" value="${selection[type]}" />
                <img src="${selection[type].slice(2)}" style="border: 0px; width: 50px; height: 50px"/>
                ${selection[type].slice(0, -2)}
                </label>
            `;
            }
            const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
            const content = `
            <style>
                .dispelMagic 
                    .form-group {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                        align-items: flex-start;
                    }
                .dispelMagic 
                    .radio-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    justify-items: center;
                    flex: 1 0 20%;
                    line-height: normal;
                    }
                .dispelMagic 
                    .radio-label input {
                    display: none;
                }
                .dispelMagic img {
                    border: 0px;
                    width: 50px;
                    height: 50px;
                    flex: 0 0 50px;
                    cursor: pointer;
                }
                /* CHECKED STYLES */
                .dispelMagic [type="radio"]:checked + img {
                    outline: 2px solid #005c8a;
                }
            </style>
            <form class="dispelMagic">
                <div class="form-group" id="types">
                    ${effectSelection}
                </div>
            </form>
        `;
            const effectToRemove = await new Promise((resolve) => {
                new Dialog({
                    title: "Choose effect to remove:",
                    content,
                    buttons: {
                        ok: {
                            label: "Ok",
                            callback: async (html) => {
                                const element = html.find("input[type='radio'][name='type']:checked").val();
                                resolve(element);
                            },
                        },
                        cancel: {
                            label: "Cancel",
                            callback: async (html) => {
                                return;
                            }
                        }
                    }
                }).render(true);
            });
            let effectToRemoveName = effectToRemove.split(",")[0];
            let removeEffect = await mba.findEffect(target.actor, effectToRemoveName);
            if (!removeEffect) {
                ui.notifications.warn("Something went wrong, unable to find the effect!");
                return;
            }
            let eventId = removeEffect.flags['mba-bestiary']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(removeEffect);
        }
    }
    else if (selection === "health") {
        let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.healthReduction === true);
        if (!effects.length) {
            ui.notifications.warn("Target is not affected by any ability reduction effects!");
            return;
        }
        if (effects.length < 2) {
            let effect = await mba.findEffect(target.actor, effects[0].name);
            if (!effect) {
                ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                return;
            }
            let eventId = effect.flags['mba-bestiary']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(effect);
        } else {
            let selection = [];
            for (let i = 0; i < effects.length; i++) {
                let effect = effects[i];
                let name = effect.name;
                let icon = effect.icon;
                let penalty = effect.flags['mba-premades']?.penalty;
                selection.push([name, penalty, icon]);
            }
            function generateEnergyBox(type) {
                return `
                <label class="radio-label">
                <input type="radio" name="type" value="${selection[type]}" />
                <img src="${selection[type].slice(2)}" style="border: 0px; width: 50px; height: 50px"/>
                ${selection[type].slice(0, -2)}
                </label>
            `;
            }
            const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
            const content = `
            <style>
                .dispelMagic 
                    .form-group {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                        align-items: flex-start;
                    }
                .dispelMagic 
                    .radio-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    justify-items: center;
                    flex: 1 0 20%;
                    line-height: normal;
                    }
                .dispelMagic 
                    .radio-label input {
                    display: none;
                }
                .dispelMagic img {
                    border: 0px;
                    width: 50px;
                    height: 50px;
                    flex: 0 0 50px;
                    cursor: pointer;
                }
                /* CHECKED STYLES */
                .dispelMagic [type="radio"]:checked + img {
                    outline: 2px solid #005c8a;
                }
            </style>
            <form class="dispelMagic">
                <div class="form-group" id="types">
                    ${effectSelection}
                </div>
            </form>
        `;
            const effectToRemove = await new Promise((resolve) => {
                new Dialog({
                    title: "Choose effect to remove:",
                    content,
                    buttons: {
                        ok: {
                            label: "Ok",
                            callback: async (html) => {
                                const element = html.find("input[type='radio'][name='type']:checked").val();
                                resolve(element);
                            },
                        },
                        cancel: {
                            label: "Cancel",
                            callback: async (html) => {
                                return;
                            }
                        }
                    }
                }).render(true);
            });
            let effectToRemoveName = effectToRemove.split(",")[0];
            let removeEffect = await mba.findEffect(target.actor, effectToRemoveName);
            if (!removeEffect) {
                ui.notifications.warn("Something went wrong, unable to find the effect!");
                return;
            }
            let eventId = removeEffect.flags['mba-bestiary']?.eventId;
            if (eventId) game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mba.removeEffect(removeEffect);
        }
    }
    else if (selection === "exhaustion") {
        let exhaustion = target.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
        if (!exhaustion.length) {
            ui.notifications.warn("Target has no levels of Exhaustion!");
            return;
        }
        let exhaustName;
        let level = +exhaustion[0].name.slice(-1);
        if (level <= 3) {
            exhaustName = `Exhaustion ${level}`;
            let effect = await mba.findEffect(target.actor, exhaustName);
            if (!effect) return;
            await mba.removeEffect(effect);
        } else {
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
        .atLocation(target)
        .scaleToObject(1.5)
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
        .file("jb2a.fireflies.few.02.purple")
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
        .file("jb2a.particles.outward.purple.01.03")
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