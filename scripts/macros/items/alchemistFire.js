async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Alchemist Fire` });
    }
    const effectData = {
        'name': "Burning",
        'icon': "modules/mba-premades/icons/conditions/burning.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are burning and take 1d4 fire damage at the start of ecah of your turns.</p>
            <p>As an action, you can make a Dexterity ability check (DC 10).</p>
            <p>On a success, you extinguish the flames and the effect ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, rollType=check, saveAbility=dex, saveDC=10, saveMagic=false, name=Burning: Action Save, killAnim=true',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'damageType=fire, damageRoll=1d4, damageBeforeSave=true, name=Burning, killAnim=true',
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
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', "Alchemist's Fire: Throw Flask", false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in compenidum! (Alchemist's Fire: Throw Flask)");
        return
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow) return;
    if (featureWorkflow.hitTargets.size) {
        mbaPremades.macros.alchemistFire.animation({ speaker, actor, token, character, item, args, scope, workflow });
        await warpgate.wait(1500);
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    } else {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
        new Sequence()

            .effect()
            .file("jb2a.throwable.throw.flask.01.orange")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .waitUntilFinished(-250)

            .effect()
            .file("jb2a.explosion.top_fracture.flask.01")
            .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scale(1.4)

            .effect()
            .file("jb2a.impact.fire.01.orange.0")
            .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scaleToObject(1.5)

            .play()
    }

    let flaskItem = workflow.actor.items.filter(i => i.name === workflow.item.name)[0];
    if (flaskItem.system.quantity > 1) {
        flaskItem.update({ "system.quantity": flaskItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [flaskItem.id]);
    }
    let emptyFlaskItem = workflow.actor.items.filter(i => i.name === "Empty Flask")[0];
    if (!emptyFlaskItem) {
        const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Flask)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyFlaskItem.update({ "system.quantity": emptyFlaskItem.system.quantity + 1 });
    }
}

async function animation({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.throwable.throw.flask.01.orange")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-250)

        .effect()
        .file("jb2a.explosion.top_fracture.flask.01")
        .attachTo(target)
        .scale(1.4)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(target)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(target)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(target)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .effect()
        .file("animated-spell-effects-cartoon.fire.114")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.2 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .playbackRate(0.85)
        .mask(target)
        .persist()
        .name(`${target.document.name} Alchemist Fire`)

        .effect()
        .file("animated-spell-effects-cartoon.fire.114")
        .attachTo(target, { offset: { x: -0.3 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .playbackRate(0.85)
        .mask(target)
        .persist()
        .name(`${target.document.name} Alchemist Fire`)

        .effect()
        .file("animated-spell-effects-cartoon.fire.114")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.35 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .playbackRate(0.85)
        .mask(target)
        .persist()
        .name(`${target.document.name} Alchemist Fire`)

        .play()
}

export let alchemistFire = {
    'item': item,
    'animation': animation
}