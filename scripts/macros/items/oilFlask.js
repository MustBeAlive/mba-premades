import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

//think of a way to implement template case
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Splash oil on somebody (5 ft.)", "splash"],
        ["Throw flask at someone (20 ft.)", "shatter"],
        ["Pour oil on the ground (5 ft. square)", "pour"],
        ["Cancel", false]
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Oil Flask", choices, `<b>What would you like to do?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "splash") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifications.warn("No target selected!");
            return;
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Splash Oil', false);
        if (!featureData) return;
        delete featureData._id;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        await game.messages.get(workflow.itemCardId).delete();
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow) return;
    }
    else if (selection === "shatter") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifications.warn("No target selected!");
            return;
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Throw Flask', false);
        if (!featureData) return;
        delete featureData._id;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        await game.messages.get(workflow.itemCardId).delete();
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow) return;
    }
    else if (selection === "pour") {
        let templateData = {
            't': "circle",
            'user': game.user,
            'distance': 3,
            'direction': 0,
            'fillColor': game.user.color,
            'flags': {
                'dnd5e': {
                    'origin': workflow.item.uuid
                },
                'midi-qol': {
                    'originUuid': workflow.item.uuid
                },
                'walledtemplates': {
                    'hideBorder': "alwaysHide",
                    'wallRestriction': 'light',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await mba.placeTemplate(templateData);
        if (!template) return;

        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.01.black")
            .atLocation(token)
            .stretchTo(template)
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.01")
            .atLocation(template)
            .scaleToObject(1.4)

            .effect()
            .file("jb2a.impact.green.9")
            .atLocation(template)
            .scaleToObject(1.5)
            .filter("ColorMatrix", { saturate: -1, brightness: -0.8 })

            .effect()
            .delay(100)
            .file('jb2a.grease.dark_brown')
            .atLocation(template)
            .size(1, { gridUnits: true })
            .fadeIn(2500)
            .fadeOut(1000)
            .scaleIn(0, 2500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "linear" })
            .zIndex(1)
            .randomRotation()
            .belowTokens()
            .persist()
            .name(`Oil Flask`)

            .play()

        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `Oil Flask` });
        }
        let templateEffectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'duration': {
                'seconds': 3600 // huh?
            },
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': false
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        await mba.createEffect(workflow.actor, templateEffectData);
    }

    let flaskItem = mba.getItem(workflow.actor, workflow.item.name);
    if (flaskItem.system.quantity > 1) {
        await flaskItem.update({ "system.quantity": flaskItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [flaskItem.id]);
    }
    if (selection === "splash" || selecion === "pour") {
        let emptyFlaskItem = await mba.getItem(workflow.actor, "Empty Flask");
        if (!emptyFlaskItem) {
            const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
            if (!itemData) {
                ui.notifications.warn("Unable to find item in compendium! (Empty Flask)");
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
            .file("jb2a.throwable.throw.flask.01.black")
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.01")
            .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scale(1.4)

            .play()

        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Oil Flask` });
    }
    const effectData = {
        'name': "Covered in Oil",
        'icon': "modules/mba-premades/icons/conditions/muddy.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are covered in oil.</p>
            <p>If you take any fire damage before the oil dries (after 1 minute), you will take an additional 5 fire damage from the burning oil.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.oilFlask.damage,preTargetDamageApplication',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.throwable.throw.flask.01.black")
        .attachTo(workflow.token)
        .stretchTo(target)
        .waitUntilFinished(-250)

        .effect()
        .file("jb2a.explosion.top_fracture.flask.01")
        .attachTo(target)
        .scale(1.4)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.impact.green.9")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .filter("ColorMatrix", { saturate: -1, brightness: -0.8 })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .filter("ColorMatrix", { brightness: -0.5 })
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Oil Flask`)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .filter("ColorMatrix", { brightness: -0.5 })
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Oil Flask`)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .filter("ColorMatrix", { brightness: -0.5 })
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Oil Flask`)

        .play()
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(actor, "Covered in Oil");
    if (!effect) return;
    let typeCheck = workflow.damageDetail?.some(i => i.type === "fire");
    if (!typeCheck) return;
    let damageFormula = '5[fire]';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Oil Flask: Burning Oil'
    });
    let damageTotal = damageRoll.total;
    let hasDR = mba.checkTrait(actor, "dr", "fire");
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': "fire"
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;

    new Sequence()

        .wait(1700)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(token)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(token)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(token)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .thenDo(async () => {
            await mba.removeEffect(effect);
        })

        .play()
}

export let oilFlask = {
    'item': item,
    'attack': attack,
    'damage': damage
}