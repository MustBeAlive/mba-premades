export async function potionOfHealing({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!item || !actor) {
        ui.notifications.warn("This macro only works from an item.");
        return;
    }

    let targets = Array.from(game.user.targets);
    let targetActor = targets.length === 1 ? targets[0].actor : actor;
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

    if (useMaxHealing) {
        let maxHealing = calculateMaxHealing(healingFormula);
        await chrisPremades.helpers.applyDamage(targets, maxHealing, 'healing');
        ui.notifications.info(`Healed ${maxHealing} hit points.`);
    } else {
        let roll = new Roll(healingFormula);
        roll.evaluate({async: false});
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: targetActor }),
            flavor: "Healing Potion"
        });
        await chrisPremades.helpers.applyDamage(targets, roll.total, 'healing');
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
}