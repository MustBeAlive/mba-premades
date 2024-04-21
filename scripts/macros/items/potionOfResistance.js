export async function potionOfResistance({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = workflow.item.name.substring(workflow.item.name.indexOf(" ") + 1).split(" ")[1].toLowerCase();
    let potioncolor;
    switch (type) {
        case 'acid':
            potioncolor = "green";
            break;
        case 'cold':
            potioncolor = "blue";
            break;
        case 'fire':
            potioncolor = "red";
            break;
        case 'force':
            potioncolor = "red";
            break;
        case 'lightning':
            potioncolor = "blue";
            break;
        case 'necrotic':
            potioncolor = "green";
            break;
        case 'poison':
            potioncolor = "green";
            break;
        case 'psychic':
            potioncolor = "purple";
            break;
        case 'radiant':
            potioncolor = "yellow";
            break;
        case 'thunder':
            potioncolor = "purple";
    };
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
    };
    let config = defaults[potioncolor];
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
        <p>You have resistance to ${type} damage for the duration.</p>
    `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 2,
                'value': type,
                'priority': 20
            }
        ]
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
            chrisPremades.helpers.createEffect(target.actor, effectData);
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