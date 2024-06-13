import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function touch({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Fire Elemental: Igniting Touch")) return;
    async function effectMacroTurnStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Fire Elemental: Igniting Touch");
        if (!effect) return;
        let choices = [["Yes (Spend Action)", "yes"], ["No (fire damage at the start of the next turn)", false]];
        let selection = await mbaPremades.helpers.dialog("Fire Elemental: Igniting Touch", choices, "Do you wish to douse the fire?");
        if (!selection) return;
        await mbaPremades.helpers.removeEffect(effect);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fire Elemental Igniting Touch` })
    }
    const effectData = {
        'name': "Fire Elemental: Igniting Touch",
        'icon': "modules/mba-premades/icons/conditions/burning.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are on fire.</p>
            <p>Until you or someone else takes an Action to douse it, you take 1d10 fire damage at the start of each of your turns.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=start, damageType=fire, damageRoll=1d10, damageBeforeSave=true, name=Igniting Touch: Turn Start, killAnim=true, fastForwardDamage=true',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

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
        .name(`${target.document.name} Fire Elemental Igniting Touch`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function fireFormCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!(workflow.item.system.actionType === 'mwak' || workflow.item.system.actionType === 'msak')) return;
    if (mba.getDistance(workflow.token, token) > 5) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Fire Elemental: Fire Form', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Fire Elemental: Fire Form)");
        return;
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(100);
    new Sequence()

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(workflow.token)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(workflow.token)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
        })

        .play()
}

async function fireFormItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = await mba.findNearby(workflow.token, 0, "enemy", false, false);
    if (!targets.length) {
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    for (let target of targets) {
        if (mba.findEffect(target.actor, "Fire Elemental: Igniting Touch")) return;
        async function effectMacroTurnStart() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Fire Elemental: Igniting Touch");
            if (!effect) return;
            let choices = [["Yes (Spend Action)", "yes"], ["No (fire damage at the start of the next turn)", false]];
            let selection = await mbaPremades.helpers.dialog("Fire Elemental: Igniting Touch", choices, "Do you wish to douse the fire?");
            if (!selection) return;
            await mbaPremades.helpers.removeEffect(effect);
        }
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fire Elemental Igniting Touch` })
        }
        const effectData = {
            'name': "Fire Elemental: Igniting Touch",
            'icon': "modules/mba-premades/icons/conditions/burning.webp",
            'origin': workflow.item.uuid,
            'description': `
                <p>You are on fire.</p>
                <p>Until you or someone else takes an Action to douse it, you take 1d10 fire damage at the start of each of your turns.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=start, damageType=fire, damageRoll=1d10, damageBeforeSave=true, name=Igniting Touch: Turn Start, killAnim=true, fastForwardDamage=true',
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onTurnStart': {
                        'script': mba.functionToString(effectMacroTurnStart)
                    },
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };

        new Sequence()

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
            .name(`${target.document.name} Fire Elemental Igniting Touch`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let fireElemental = {
    'touch': touch,
    'fireFormCast': fireFormCast,
    'fireFormItem': fireFormItem
}