export async function greaterRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices = [
        ['Charmed', 'charm'],
        ['Petrified', 'petr'],
        ['Cursed', 'curse'],
        ['Ability Score Reduction', 'ability'],
        ['Hit Point Maximum Reduction', 'health'],
        ['Up to 3 levels of Exhaustion', 'exhaustion']
    ];
    let selection = await chrisPremades.helpers.dialog('Which condition do you wish to remove?', choices);
    if (!selection) return;
    let effect;
    switch (selection) {
        case 'charm': {
            effect = await chrisPremades.helpers.findEffect(target.actor, "Charmed");
            if (!effect) {
                ui.notifications.warn("Target is not charmed!");
                return;
            }
            await chrisPremades.helpers.removeEffect(effect);
            break;
        }
        case 'petr': {
            effect = await chrisPremades.helpers.findEffect(target.actor, "Petrified");
            if (!effect) {
                ui.notifications.warn("Target is not petrified!");
                return;
            }
            await chrisPremades.helpers.removeEffect(effect);
            break;
        }
        case 'curse': {
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
            effect = await chrisPremades.helpers.findEffect(target.actor, "Hexed");
            if (effect) await chrisPremades.helpers.removeEffect(effect);
            break;
        }
        case 'ability': {
            let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.abilityReduction === true);
            if (!effects.length) {
                ui.notifications.warn("Target is not affected by any ability reduction effects!");
                return;
            }
            if (effects.length < 2) {
                let effect = await chrisPremades.helpers.findEffect(target.actor, effects[0].name);
                if (!effect) {
                    ui.notifications.warn(`Unable to find effect: ${effects[0].name}`);
                    return;
                }
                await chrisPremades.helpers.removeEffect(effect);
                break;
            }
            break;
        }
        case 'health': {
            let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.healthReduction === true);
            if (!effects.length) {
                ui.notifications.warn("Target is not affected by any ability reduction effects!");
                return;
            }
            break;
        }
        case 'exhaustion': {
            let exhaustion = target.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
            console.log(exhaustion);
            if (!exhaustion.length) {
                ui.notifications.warn("Target has no levels of Exhaustion!");
                return;
            }
            let exhaustName;
            let level = +exhaustion[0].name.slice(-1);
            if (level <= 3) {
                exhaustName = `Exhaustion ${level}`;
                let effect = await chrisPremades.helpers.findEffect(target.actor, exhaustName);
                if (!effect) return;
                await chrisPremades.helpers.removeEffect(effect);
                break;
            }
            level -= 3;
            exhaustName = `Exhaustion ${level}`;
            await chrisPremades.helpers.addCondition(target.actor, exhaustName);
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