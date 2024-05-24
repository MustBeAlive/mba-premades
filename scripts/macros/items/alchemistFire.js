import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

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
                'value': 'turn=start, damageType=fire, damageRoll=1d4, damageBeforeSave=true, name=Burning, killAnim=true, fastForwardDamage=true',
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
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', "Alchemist's Fire: Throw Flask", false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in compendium! (Alchemist's Fire: Throw Flask)");
        return
    }
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow) return;
    if (featureWorkflow.hitTargets.size) {
        mbaPremades.macros.alchemistFire.animation({ speaker, actor, token, character, item, args, scope, workflow });
        await warpgate.wait(1500);
        await mba.createEffect(target.actor, effectData);
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

    let flaskItem = mba.getItem(workflow.actor, workflow.item.name);
    if (flaskItem.system.quantity > 1) {
        await flaskItem.update({ "system.quantity": flaskItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [flaskItem.id]);
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
        .file("jb2a.flames.orange.03.1x1.0")
        .delay(300)
        .attachTo(target, { offset: { x: 0, y: -0.15 }, gridUnits: true })
        .scaleToObject(1.4)
        .belowTokens(false)
        .opacity(0.8)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} Alchemist Fire`)

        .play()
}

export let alchemistFire = {
    'item': item,
    'animation': animation
}