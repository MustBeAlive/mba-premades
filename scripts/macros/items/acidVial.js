async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let choices = [
        ["Splash acid on somebody (5 ft.)", "splash"],
        ["Throw vial at someone (20 ft.)", "shatter"],
        ["Cancel", "cancel"]
    ];
    let selection = await chrisPremades.helpers.dialog("What would you like to do?", choices);
    if (!selection || selection === "cancel") return;
    let featureData;
    if (selection === "splash") {
        featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Acid Vial: Splash Acid', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in compenidum! (Acid Vial: Splash Acid)");
            return
        }
    }
    if (selection === "shatter") {
        featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Acid Vial: Throw Vial', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in compenidum! (Acid Vial: Throw Vial)");
            return
        }
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow) return;
    
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
    let damageRoll = await new Roll('2d6[acid]').roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Acid Vial'
    });

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

        .thenDo(function () {
            chrisPremades.helpers.applyDamage(target, damageRoll.total, 'acid')
        })

        .effect()
        .file("jb2a.impact.green.9")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)

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