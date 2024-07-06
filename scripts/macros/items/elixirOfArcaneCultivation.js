import {mba} from "../../helperFunctions.js";

export async function elixirOfArcaneCultivation({ speaker, actor, token, character, item, args, scope, workflow }) {
    let type = workflow.item.name.substring(workflow.item.name.indexOf(" ") + 1).split(" ")[1].toLowerCase();
    let pact = workflow.actor.system.spells.pact.max;
    let pactLevel;
    let current;
    let max;
    let level;
    let path;
    switch (type) {
        case "normal": {
            current = workflow.actor.system.spells.spell1.value;
            max = workflow.actor.system.spells.spell1.max;
            level = 1;
            path = `system.spells.spell1.value`;
            break;
        }
        case "greater": {
            current = workflow.actor.system.spells.spell2.value;
            max = workflow.actor.system.spells.spell2.max;
            level = 2;
            path = `system.spells.spell2.value`;
            break;
        }
        case "superior": {
            current = workflow.actor.system.spells.spell3.value;
            max = workflow.actor.system.spells.spell3.max;
            level = 3;
            path = `system.spells.spell3.value`;
            break;
        }
        case "supreme": {
            current = workflow.actor.system.spells.spell4.value;
            max = workflow.actor.system.spells.spell4.max;
            level = 4;
            path = `system.spells.spell4.value`;
            break;
        }
    }
    if (pact > 0 ) {
        current = workflow.actor.system.spells.pact.value;
        max = workflow.actor.system.spells.pact.max;
        pactLevel = workflow.actor.system.spells.pact.level;
        path = `system.spells.pact.value`;
        if (pactLevel != level) {
            ui.notifications.info(`Your spellslots are Level ${pactLevel} and can not be recovered with Level ${level} potion`);
            await game.messages.get(workflow.itemCardId).delete();
            return;
        }
    }
    if (current >= max) {
        ui.notifications.info(`You don't have any spent Level ${level} slots!`);
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }

    await new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(token, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
        .opacity(0.9)
        .rotate(90)
        .filter("ColorMatrix", { saturate: 1, hue: 230 })
        .zIndex(1)

        .wait(200)

        .effect()
        .file(`jb2a.sacred_flame.source.yellow`)
        .attachTo(token, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
        .startTime(3400)
        .scaleToObject(2.2)
        .fadeOut(500)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(1)

        .effect()
        .from(token)
        .scaleToObject(token.document.texture.scaleX)
        .opacity(0.3)
        .duration(1250)
        .fadeIn(100)
        .fadeOut(600)
        .filter("Glow", { color: "0xffbb00" })
        .tint("0xffbb00")

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
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
            await workflow.actor.update({ [path]: current += 1 });
        })

        .play();

    let vialItem = await mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = mba.getItem(workflow.actor, "Empty Vial");
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