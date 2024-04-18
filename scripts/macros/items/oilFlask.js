async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Splash oil on somebody (5 ft.)", "splash"],
        ["Throw flask at someone (20 ft.)", "shatter"],
        ["Pour oil on the ground (5 ft. square)", "pour"],
        ["Cancel", "cancel"]
    ];
    let selection = await chrisPremades.helpers.dialog("What would you like to do?", choices);
    if (!selection || selection === "cancel") return;
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
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (selection === "splash") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifiactions.warn("No target selected!");
            return;
        }
        let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Splash Oil', false);
        if (!featureData) {
            ui.notifications.warn('Can\'t find item in compenidum! (Oil Flask: Splash Oil)');
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        await game.messages.get(workflow.itemCardId).delete();
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (featureWorkflow.hitTargets.size) {
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        } else {
            let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
            let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
            new Sequence()

                .effect()
                .file("jb2a.throwable.throw.flask.01.black")
                .attachTo(token)
                .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
                .waitUntilFinished(-300)

                .effect()
                .file("jb2a.impact.006.yellow")
                .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
                .scaleToObject(2 * target.document.texture.scaleX)
                .filter("ColorMatrix", { saturate: 0.5, brightness: -1 })

                .play()
        }
    }
    if (selection === "shatter") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifiactions.warn("No target selected!");
            return;
        }
        let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Throw Flask', false);
        if (!featureData) {
            ui.notifications.warn('Can\'t find item in compenidum! (Oil Flask: Throw Flask)');
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        await game.messages.get(workflow.itemCardId).delete();
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (featureWorkflow.hitTargets.size) {
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        } else {
            let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
            let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
            new Sequence()

                .effect()
                .file("jb2a.throwable.throw.flask.01.black")
                .attachTo(token)
                .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
                .waitUntilFinished(-300)

                .effect()
                .file("jb2a.impact.006.yellow")
                .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
                .scaleToObject(2 * target.document.texture.scaleX)
                .filter("ColorMatrix", { saturate: 0.5, brightness: -1 })

                .play()
        }
    }
    if (selection === "pour") {
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
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await chrisPremades.helpers.placeTemplate(templateData);
        if (!template) return;

        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.01.black")
            .attachTo(token)
            .stretchTo(template)
            .waitUntilFinished(-300)

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
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        await chrisPremades.helpers.createEffect(workflow.actor, templateEffectData);
    }
    let oilFlaskItem = workflow.actor.items.filter(i => i.name === "Oil Flask")[0];
    if (oilFlaskItem.system.quantity > 1) {
        oilFlaskItem.update({ "system.quantity": oilFlaskItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [oilFlaskItem.id]);
    }
    let emptyFlaskItem = workflow.actor.items.filter(i => i.name === "Empty Flask");
    if (!emptyFlaskItem.length) {
        const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Flask)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyFlaskItem[0].update({ "system.quantity": emptyFlaskItem[0].system.quantity + 1 });
    }
}

async function animation({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.throwable.throw.flask.01.black")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-300)

        .effect()
        .file("jb2a.impact.006.yellow")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .filter("ColorMatrix", { saturate: 0.5, brightness: -1 })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .filter("ColorMatrix", { brightness: -0.5 })
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
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
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
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
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Oil Flask`)

        .play()
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await chrisPremades.helpers.findEffect(actor, "Covered in Oil");
    if (!effect) return;
    let typeCheck = workflow.damageDetail?.some(i => i.type === "fire");
    if (!typeCheck) return;
    let damageFormula = '5[fire]';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Oil Flask: Burning Oil'
    });
    let damageTotal = damageRoll.total;
    let hasDR = chrisPremades.helpers.checkTrait(actor, "dr", "fire");
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': "fire"
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
    new Sequence()

        .wait(1600)

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

        /*
        .thenDo(function () {
            chrisPremades.helpers.removeEffect(effect);
        })
        */

        .play()
}

export let oilFlask = {
    'item': item,
    'animation': animation,
    'damage': damage
}