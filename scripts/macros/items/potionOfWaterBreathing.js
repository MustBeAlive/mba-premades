import {mba} from "../../helperFunctions.js";

export async function potionOfWaterBreathing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You gain ability to breathe underwater for the duration.</p>
        `,
        'duration': {
            'seconds': 3600
        },
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
        .opacity(0.9)
        .rotate(90)
        .filter("ColorMatrix", { saturate: 1, hue: -105 })
        .zIndex(1)

        .wait(200)

        .effect()
        .file(`jb2a.sacred_flame.source.green`)
        .attachTo(target, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
        .startTime(3400)
        .scaleToObject(2.2)
        .fadeOut(500)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(1)

        .effect()
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .opacity(0.3)
        .duration(1250)
        .fadeIn(100)
        .fadeOut(600)
        .filter("Glow", { color: "0xbbf000" })
        .tint("0xbbf000")

        .effect()
        .file(`jb2a.particles.outward.greenyellow.01.03`)
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
            await mba.createEffect(target.actor, effectData);
        })

        .play();

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