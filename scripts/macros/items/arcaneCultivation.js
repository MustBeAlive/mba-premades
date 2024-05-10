import {mba} from "../../helperFunctions.js";

export async function arcaneCultivation({ speaker, actor, token, character, item, args, scope, workflow }) {
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
        case "supreme": {
            current = workflow.actor.system.spells.spell3.value;
            max = workflow.actor.system.spells.spell3.max;
            level = 3;
            path = `system.spells.spell3.value`;
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
    current += 1;
    let potioncolor = "yellow";
    let defaults = {
        "yellow": {
            "color": "yellow",
            "particles": "orange",
            "tintColor": "0xffbb00",
            "hue1": 230,
            "hue2": 10,
            "hue3": 0,
            "saturate": 1
        }
    };
    let config = defaults[potioncolor];

    await new Sequence()

        .wait(500)

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(token, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
        .opacity(0.9)
        .rotate(90)
        .filter("ColorMatrix", { saturate: config.saturate, hue: config.hue1 })
        .zIndex(1)

        .wait(200)

        .effect()
        .file(`jb2a.sacred_flame.source.${config.color}`)
        .attachTo(token, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
        .startTime(3400)
        .scaleToObject(2.2)
        .fadeOut(500)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { hue: config.hue3 })
        .zIndex(1)

        .effect()
        .from(token)
        .scaleToObject(token.document.texture.scaleX)
        .opacity(0.3)
        .duration(1250)
        .fadeIn(100)
        .fadeOut(600)
        .filter("Glow", { color: config.tintColor })
        .tint(config.tintColor)

        .effect()
        .file(`jb2a.particles.outward.${config.particles}.01.03`)
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

        .thenDo(function () {
            workflow.actor.update({ [path]: current });
        })

        .play();

    let vialItem = mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = mba.getItem(workflow.actor, "Empty Vial");
    if (!emptyVialItem) {
        const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Vial)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}