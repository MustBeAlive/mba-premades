export async function potionOfHealing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    let potionType = workflow.item.name.substring(workflow.item.name.indexOf(" ") + 1).split(" ")[1].toLowerCase();
    let healingFormula;
    switch (potionType) {
        case "normal":
            healingFormula = "2d4+2[healing]";
            break;
        case "greater":
            healingFormula = "4d4+4[healing]";
            break;
        case "superior":
            healingFormula = "8d4+8[healing]";
            break
        case "supreme":
            healingFormula = "10d4+20[healing]";
            break;
        default:
            return null;
    };
    if (!healingFormula) {
        ui.notifications.warn("Unrecognized potion type.");
        return;
    };
    let choices = [["Action (max healing)", "action"], ["Bonus (roll healing)", "bonus"], ["Cancel", "cancel"]];
    let selection = await chrisPremades.helpers.dialog("Choose action type:", choices);
    if (!selection || selection === "cancel") return;
    let healAmmount;
    if (selection === "action") {
        let parts = healingFormula.split('+');
        let dicePart = parts[0];
        let modifier = parts.length > 1 ? parseInt(parts[1]) : 0;
        let diceMax = dicePart.match(/(\d+)d(\d+)/);
        let numDice = parseInt(diceMax[1]);
        let diceType = parseInt(diceMax[2]);
        let maxDiceRoll = numDice * diceType;
        let maxFormula = maxDiceRoll + modifier + "[healing]";
        let healingRoll = await new Roll(maxFormula).roll({ 'async': true });
        await healingRoll.toMessage({
            rollMode: 'roll',
            speaker: { actor: target.actor },
            flavor: 'Potion of Healing'
        });
        healAmmount = healingRoll.total;
    } else {
        let healingRoll = await new Roll(healingFormula).roll({ 'async': true });
        await healingRoll.toMessage({
            rollMode: 'roll',
            speaker: { actor: target.actor },
            flavor: 'Potion of Healing'
        });
        healAmmount = healingRoll.total;
    }

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

        .thenDo(function () {
            chrisPremades.helpers.applyDamage(target, healAmmount, 'healing')
        })

        .play();

    let vialItem = workflow.actor.items.filter(i => i.name === workflow.item.name)[0];
    if (vialItem.system.quantity > 1) {
        vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = workflow.actor.items.filter(i => i.name === "Empty Vial")[0];
    if (!emptyVialItem) {
        const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Vial)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}