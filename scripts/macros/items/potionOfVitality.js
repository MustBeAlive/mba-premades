import {mba} from "../../helperFunctions.js";

export async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the next 24 hours, you regain the maximum number of hit points for any Hit Die you spend.</p>
        `,
        'duration': {
            'seconds': 86400
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

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play();

    //Exhaustion block
    let exhaustion = target.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
    if (exhaustion.length) {
        let exhaustionEffect = await mba.findEffect(target.actor, exhaustion[0].name);
        if (exhaustionEffect) await mba.removeEffect(exhaustionEffect);
    }

    //Disease block
    let diseases = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true);
    if (diseases.length) {
        let names = [];
        for (let disease of diseases) names.push(disease.name);
        for (let name of names) {
            let effect = await mba.findEffect(target.actor, name);
            if (effect) await mba.removeEffect(effect);
        }
    }

    //Poison block
    let poisons = target.actor.effects.filter(i => i.name.includes("Poison"));
    if (poisons.length) {
        for (let i of poisons) {
            let effect = await mba.findEffect(target.actor, i.name);
            if (effect) await mba.removeEffect(effect);
        }
    }

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

async function hitDie(actor, config, denom) {
    let [effect] = actor.effects.filter(e => e.name === "Potion of Vitality");
    if (!effect) return;
    let maxDie = denom.slice(1);
    config.formula = `${maxDie} + @abilities.con.mod`;
    return;
}

export let potionOfVitality = {
    'item': item,
    'hitDie': hitDie
}