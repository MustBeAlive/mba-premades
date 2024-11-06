import {mba} from "../../helperFunctions.js";

export async function potionOfHealing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    let potionType = workflow.item.name.substring(workflow.item.name.indexOf(" ") + 1).split(" ")[1].toLowerCase();
    let healingFormula;
    let healingRoll;
    let exhaustion;
    switch (potionType) {
        case "normal":
            healingFormula = "2d4+2[healing]";
            break;
        case "greater":
            healingFormula = "4d4+4[healing]";
            exhaustion = 1;
            break;
        case "superior":
            healingFormula = "8d4+8[healing]";
            exhaustion = 3;
            break
        case "supreme":
            healingFormula = "10d4+20[healing]";
            exhaustion = 6;
            break;
        default:
            return null;
    };
    if (!healingFormula) {
        ui.notifications.warn("Unrecognized potion type.");
        return;
    };
    let typeSelection = "heal";
    if (exhaustion) {
        await mba.playerDialogMessage(game.user);
        typeSelection = await mba.dialog("Potion of healing", [["<b>Heal</b> target", "heal"], ["Remove <b>Exhaustion</b> levels", "exhaustion"]], "<b>What would you like to do?</b>");
        await mba.clearPlayerDialogMessage();
        if (!typeSelection) return;
    }
    if (typeSelection === "exhaustion") {
        let exhaustionEffect = target.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
        if (!exhaustionEffect) {
            ui.notifications.warn("Target has no levels of Exhaustion!");
            return;
        }
        let level = +exhaustionEffect.name.slice(-1);
        if (level === 0) level = 10;
        if (level <= exhaustion) await mba.removeCondition(target.actor, `Exhaustion ${level}`);
        else if (level > exhaustion ) {
            await mba.removeCondition(target.actor, `Exhaustion ${level}`);
            await mba.addCondition(target.actor, `Exhaustion ${level - exhaustion}`);
        }
    }
    else if (typeSelection === "heal") {
        let choices = [["Action (max healing)", "action"], ["Bonus (roll healing)", "bonus"], ["Cancel", false]];
        let selection = await mba.dialog("Potion of Healing", choices, `<b>Choose action type:</b>`);
        if (!selection) return;
        if (selection === "action") {
            let parts = healingFormula.split('+');
            let dicePart = parts[0];
            let modifier = parts.length > 1 ? parseInt(parts[1]) : 0;
            let diceMax = dicePart.match(/(\d+)d(\d+)/);
            let numDice = parseInt(diceMax[1]);
            let diceType = parseInt(diceMax[2]);
            let maxDiceRoll = numDice * diceType;
            let maxFormula = maxDiceRoll + modifier + "[healing]";
            healingRoll = await new Roll(maxFormula).roll({ 'async': true });
        } 
        else healingRoll = await new Roll(healingFormula).roll({ 'async': true });
        

        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.water.05")
            .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
            .scaleToObject(1.4)
            .opacity(0.9)
            .rotate(90)
            .filter("ColorMatrix", { saturate: 1, hue: 180 })
            .zIndex(1)

            .wait(200)

            .effect()
            .file(`jb2a.sacred_flame.source.green`)
            .attachTo(target, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
            .startTime(3400)
            .scaleToObject(2.2)
            .fadeOut(500)
            .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
            .filter("ColorMatrix", { hue: 275 })
            .zIndex(1)

            .effect()
            .from(target)
            .scaleToObject(target.document.texture.scaleX)
            .opacity(0.3)
            .duration(1250)
            .fadeIn(100)
            .fadeOut(600)
            .filter("Glow", { color: "0xec0927" })
            .tint("0xec0927")

            .effect()
            .file(`jb2a.particles.outward.red.01.03`)
            .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
            .scale(0.6)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .zIndex(0.3)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                if (typeSelection === "heal") await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
            })

            .play();
    }

    let vialItem = await mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = await mba.getItem(workflow.actor, "Empty Vial");
    if (!emptyVialItem) {
        const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compendium! (Empty Vial)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        await emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}