import { mba } from "../../helperFunctions.js";

export async function antitoxin({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    let potioncolor = "green";
    let defaults = {
        "green": {
            "color": "green",
            "particles": "greenyellow",
            "tintColor": "0xbbf000",
            "hue1": -105,
            "hue2": 35,
            "hue3": 0,
            "saturate": 1
        }
    };
    let config = defaults[potioncolor];
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on saving throws against poison for the duration.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.CR.poisoned',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.adv-reminder.message.ability.save.con',
                'mode': 2,
                'value': "Antitoxin: advantage on saving throws against poison.",
                'priority': 20
            }
        ],
        'flags': {

        }
    };

    await new Sequence()

        .wait(500)

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
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
            if (type != "undead" && type != "construct") {
                mba.createEffect(target.actor, effectData);
            }
        })

        .play();

    let vialItem = mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
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
        await emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}