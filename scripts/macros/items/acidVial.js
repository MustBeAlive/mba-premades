import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let choices = [
        ["Splash acid on somebody (5 ft.)", "splash"],
        ["Throw vial at someone (20 ft.)", "shatter"],
        ["Cancel", false]
    ];
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Acid Vial", choices, `<b>What would you like to do?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let featureData;
    if (selection === "splash") featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Acid Vial: Splash Acid', false);
    else if (selection === "shatter") featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Acid Vial: Throw Vial', false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow) return;

    let vialItem = await mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    
    if (selection === "splash") {
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
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.03.green")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.03")
            .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scale(1.4)

            .play()

        return
    }

    new Sequence()

        .effect()
        .file("jb2a.throwable.throw.flask.03.green")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-250)

        .effect()
        .file("jb2a.explosion.top_fracture.flask.03")
        .attachTo(target)
        .scale(1.4)

        .thenDo(async () => {
            await mba.applyDamage(target, damageRoll.total, 'acid')
        })

        .effect()
        .file("jb2a.liquid.splash.bright_green")
        .atLocation(target, { offset: { x: 0 }, gridUnits: true })
        .opacity(1)
        .randomRotation()
        .size(1, { gridUnits: true })
        .filter("ColorMatrix", { saturate: 0, hue: -35 })
        .zIndex(3)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(0.2)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(0.2)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.3)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(0.2)

        .play()
}

export let acidVial = {
    'item': item,
    'attack': attack
}