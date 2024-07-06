import {mba} from "../../helperFunctions.js";

export async function elixirOfHealth({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let blinded = await mba.findEffect(target.actor, "Blinded");
    if (blinded) await mba.removeEffect(blinded);
    let deafened = await mba.findEffect(target.actor, "Deafened");
    if (deafened) await mba.removeEffect(deafened);
    let paralyzed = await mba.findEffect(target.actor, "Paralyzed");
    if (paralyzed) await mba.removeEffect(paralyzed);
    let poisoned = await mba.findEffect(target.actor, "Poisoned");
    if (poisoned) await mba.removeEffect(poisoned);
    let diseases = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true);
    if (diseases.length) {
        let names = [];
        for (let disease of diseases) names.push(disease.name);
        for (let name of names) {
            let effect = await mba.findEffect(target.actor, name);
            if (effect) await mba.removeEffect(effect);
        }
    }
    new Sequence()

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