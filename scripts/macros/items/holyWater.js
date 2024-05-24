import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let choices = [
        ["Splash Holy Water on somebody (5 ft.)", "splash"],
        ["Throw flask of Holy Water at someone (20 ft.)", "shatter"],
        ["Cancel", "cancel"]
    ];
    let selection = await mba.dialog("Holy Water", choices, `<b>What would you like to do?</b>`);
    if (!selection || selection === "cancel") return;
    let featureData;
    if (selection === "splash") {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Holy Water: Splash Water', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in compenidum! (Holy Water: Splash Water)");
            return
        }
    }
    else if (selection === "shatter") {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Holy Water: Throw Flask', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in compenidum! (Holy Water: Throw Flask)");
            return
        }
    }
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow) return;
    let flaskItem = mba.getItem(workflow.actor, workflow.item.name);
    if (flaskItem.system.quantity > 1) {
        await flaskItem.update({ "system.quantity": flaskItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [flaskItem.id]);
    }
    if (selection === "splash") {
        let emptyFlaskItem = mba.getItem(workflow.actor, "Empty Flask");
        if (!emptyFlaskItem) {
            const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
            if (!itemData) {
                ui.notifications.warn("Unable to find item in compenidum! (Empty Flask)");
                return
            }
            await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
        } else {
            await emptyFlaskItem.update({ "system.quantity": emptyFlaskItem.system.quantity + 1 });
        }
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.01.white")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.03")
            .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scale(1.4)

            .play()

        return;
    }
    let type = await mba.raceOrType(target.actor).toLowerCase();
    if (type === "undead" || type === 'fiend') {
        let damageRoll = await new Roll('2d6[radiant]').roll({ 'async': true });
        await damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: 'Holy Water'
        });
        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.01.white")
            .attachTo(token)
            .stretchTo(target)
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.01")
            .attachTo(target)
            .scale(1.4)

            .effect()
            .file("jb2a.divine_smite.target.yellowwhite")
            .atLocation(target)
            .rotateTowards(token)
            .scaleToObject(3)
            .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
            .mirrorY()
            .rotate(90)
            .zIndex(2)
            .startTime(400)

            .thenDo(function () {
                mba.applyDamage(target, damageRoll.total, 'radiant')
            })

            .play()

        return;
    }
    ui.notifications.info("Unfortunately, target is neither fiend nor undead.")

    new Sequence()

        .effect()
        .file("jb2a.throwable.throw.flask.01.white")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-250)

        .effect()
        .file("jb2a.explosion.top_fracture.flask.01")
        .attachTo(target)
        .scale(1.4)

        .play()
}

export let holyWater = {
    'item': item,
    'attack': attack
}