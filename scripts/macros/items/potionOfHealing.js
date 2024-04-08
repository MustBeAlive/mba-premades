export async function potionOfHealing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let healingFormula = getHealingFormula(item.name);

    function getHealingFormula(potionName) {
        let typeMatch = potionName.match(/\(([^)]+)\)/);
        if (!typeMatch) return null;

        let potionType = typeMatch[1].toLowerCase();

        switch (potionType) {
            case "normal":
                return "2d4+2[healing]";
            case "greater":
                return "4d4+4[healing]";
            case "superior":
                return "8d4+8[healing]";
            case "supreme":
                return "10d4+20[healing]";
            default:
                return null;
        }
    }

    if (!healingFormula) {
        ui.notifications.warn("Unrecognized potion type.");
        return;
    }

    let useMaxHealing = await askActionOrBonus();

    function askActionOrBonus() {
        return new Promise(resolve => {
            new Dialog({
                title: "Potion Usage",
                content: "<p>Drink as an action (max healing) </p><p>or bonus action (roll healing)?</p>",
                buttons: {
                    action: {
                        label: "Action",
                        callback: () => resolve(true)
                    },
                    bonusAction: {
                        label: "Bonus Action",
                        callback: () => resolve(false)
                    }
                },
                default: "bonusAction",
                close: () => resolve(false)
            }).render(true);
        });
    }

    let potioncolor = scope.color ? scope.color : "red";
    let defaults = {
    "blue": {
        "color": "blue",
        "particles": "blue",
        "tintColor": "0x2cf2ee",
        "hue1": 10,
        "hue2": -200,
        "hue3": 0,
        "saturate": 1
    },
    "green": {
        "color": "green",
        "particles": "greenyellow",
        "tintColor": "0xbbf000",
        "hue1": -105,
        "hue2": 35,
        "hue3": 0,
        "saturate": 1
    },
    "purple": {
        "color": "purple",
        "particles": "purple",
        "tintColor": "f50f95",
        "hue1": 135,
        "hue2": -95,
        "hue3": 0,
        "saturate": 1
    },
    "yellow": {
        "color": "yellow",
        "particles": "orange",
        "tintColor": "0xffbb00",
        "hue1": 230,
        "hue2": 10,
        "hue3": 0,
        "saturate": 1
    },
    "red": {
        "color": "green",
        "particles": "red",
        "tintColor": "0xec0927",
        "hue1": 180,
        "hue2": -30,
        "hue3": 275,
        "saturate": 1
    },
}
    let config = defaults[potioncolor]
    config ??= defaults.red

    if (useMaxHealing) {
        let maxHealing = calculateMaxHealing(healingFormula);
        potionAnimation(target, config);
        await chrisPremades.helpers.applyDamage(target, maxHealing, 'healing');
        ui.notifications.info(`Healed ${maxHealing} hit points.`);
    } else {
        let roll = new Roll(healingFormula);
        roll.evaluate({ async: false });
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: target.actor }),
            flavor: "Healing Potion"
        });
        potionAnimation(target, config);
        await chrisPremades.helpers.applyDamage(target, roll.total, 'healing');
        ui.notifications.info(`Healed ${roll.total} hit points.`);
    }


    function calculateMaxHealing(formula) {
        let parts = formula.split('+');
        let dicePart = parts[0];
        let modifier = parts.length > 1 ? parseInt(parts[1]) : 0;

        let diceMax = dicePart.match(/(\d+)d(\d+)/);
        let numDice = parseInt(diceMax[1]);
        let diceType = parseInt(diceMax[2]);
        let maxDiceRoll = numDice * diceType;

        return maxDiceRoll + modifier;
    }

    function potionAnimation() {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.water.05")
            .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
            .scaleToObject(1.25)
            .opacity(0.9)
            .rotate(90)
            .filter("ColorMatrix", { saturate: config.saturate, hue: config.hue1 })
            .zIndex(1)

            .wait(200)

            .effect()
            .file(`jb2a.sacred_flame.source.${config.color}`)
            .attachTo(target, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
            .startTime(3400)
            .scaleToObject(2.2)
            .fadeOut(500)
            .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
            .filter("ColorMatrix", { hue: config.hue3 })
            .zIndex(1)

            .effect()
            .from(target)
            .scaleToObject(target.document.texture.scaleX)
            .opacity(0.3)
            .duration(1250)
            .fadeIn(100)
            .fadeOut(600)
            .filter("Glow", { color: config.tintColor })
            .tint(config.tintColor)

            .effect()
            .file(`jb2a.particles.outward.${config.particles}.01.03`)
            .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
            .scale(0.5)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .zIndex(0.3)

            .wait(1000)

            .play();
    }
}