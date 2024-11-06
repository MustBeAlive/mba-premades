import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function hurlFlame({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.orange.005")
            .scaleToObject(2)
            .attachTo(workflow.token)
            .belowTokens()
            .atLocation(workflow.token)
            .fadeIn(200)
            .fadeOut(550)
            .filter("ColorMatrix", { hue: 180 })

            .wait(450)

            .effect()
            .file("animated-spell-effects-cartoon.fire.25")
            .atLocation(workflow.token, { offset: { x: 0, y: -30 } })
            .scaleToObject(2.1)
            .belowTokens()
            .filter("ColorMatrix", { hue: 180 })
            .waitUntilFinished(-650)

            .effect()
            .file("animated-spell-effects-cartoon.fire.25")
            .atLocation(workflow.token, { offset: { x: 0, y: 30 } })
            .mirrorY()
            .scaleToObject(2.1)
            .belowTokens()
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-650)

            .effect()
            .file("animated-spell-effects-cartoon.fire.19")
            .atLocation(workflow.token)
            .rotate(-110)
            .scaleToObject(2)
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-850)


            .effect()
            .file("animated-spell-effects-cartoon.fire.32")
            .atLocation(workflow.token)
            .spriteOffset({ x: 30, y: 10 })
            .scaleToObject(2.1)
            .mirrorX()
            .rotate(-90)
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-1150)

            .effect()
            .file("animated-spell-effects-cartoon.fire.03")
            .atLocation(workflow.token)
            .scaleToObject(2.1)
            .rotate(90)
            .spriteOffset({ x: 10, y: -15 })
            .mirrorX()
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-700)


            .effect()
            .file("animated-spell-effects-cartoon.fire.13")
            .atLocation(workflow.token)
            .scaleToObject(0.5)
            .opacity(0.9)
            .spriteOffset({ x: -10, y: -10 })
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-1000)

            .effect()
            .file("animated-spell-effects-cartoon.fire.20")
            .atLocation(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .filter("ColorMatrix", { hue: 170 })
            .waitUntilFinished(-1000)

            .play();

        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.static.orange.005")
        .scaleToObject(2)
        .attachTo(workflow.token)
        .belowTokens()
        .atLocation(workflow.token)
        .fadeIn(200)
        .fadeOut(550)
        .filter("ColorMatrix", { hue: 180 })

        .wait(450)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(workflow.token, { offset: { x: 0, y: -30 } })
        .scaleToObject(2.1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.25")
        .atLocation(workflow.token, { offset: { x: 0, y: 30 } })
        .mirrorY()
        .scaleToObject(2.1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-650)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .atLocation(workflow.token)
        .rotate(-110)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-850)


        .effect()
        .file("animated-spell-effects-cartoon.fire.32")
        .atLocation(workflow.token)
        .spriteOffset({ x: 30, y: 10 })
        .scaleToObject(2.1)
        .mirrorX()
        .rotate(-90)
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-1150)

        .effect()
        .file("animated-spell-effects-cartoon.fire.03")
        .atLocation(workflow.token)
        .scaleToObject(2.1)
        .rotate(90)
        .spriteOffset({ x: 10, y: -15 })
        .mirrorX()
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-700)


        .effect()
        .file("animated-spell-effects-cartoon.fire.13")
        .atLocation(workflow.token)
        .scaleToObject(0.5)
        .opacity(0.9)
        .spriteOffset({ x: -10, y: -10 })
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.20")
        .atLocation(workflow.token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.35")
        .atLocation(target)
        .scaleToObject(1.3)
        .randomRotation()
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 170 })
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.wall")
        .atLocation(target)
        .spriteOffset({ x: 0, y: 30 })
        .fadeIn(200)
        .scaleToObject(1.5)
        .mask()
        .fadeOut(2000)
        .duration(5000)
        .filter("ColorMatrix", { hue: 170 })

        .play()
}

async function teleport({ speaker, actor, token, character, item, args, scope, workflow }) {
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    await mba.gmDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, 10, workflow.item.img, interval, workflow.token.document.width);
    await mba.clearGMDialogMessage();
    if (position.cancelled) return;

    new Sequence()

        .animation()
        .delay(800)
        .on(workflow.token)
        .fadeOut(200)

        .effect()
        .file("jb2a.misty_step.01.blue")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file("jb2a.misty_step.02.blue")
        .atLocation(workflow.token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(workflow.token)
        .fadeIn(200)

        .play();
}

async function touch({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Entropic Flame: Igniting Touch")) return;
    async function effectMacroTurnStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Entropic Flame: Igniting Touch");
        if (!effect) return;
        let choices = [["Yes (Spend Action)", "yes"], ["No (fire damage at the start of the next turn)", false]];
        let selection = await mbaPremades.helpers.dialog("Entropic Flame: Igniting Touch", choices, "Do you wish to douse the fire?");
        if (!selection) return;
        await mbaPremades.helpers.removeEffect(effect);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EnFl IgT` })
    }
    const effectData = {
        'name': "Entropic Flame: Igniting Touch",
        'icon': "modules/mba-premades/icons/drakkenheim/entropic_flame_fire_form.webp",
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
        .filter("ColorMatrix", { hue: 180 })
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(target)
        .scaleToObject(1.8)
        .filter("ColorMatrix", { hue: 170 })

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(target)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 170 })

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
        .filter("ColorMatrix", { hue: 180 })
        .name(`${target.document.name} EnFl IgT`)

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
    if (!featureData) return;
    featureData.name = "Entropic Flame: Fire Form";
    featureData.img = "modules/mba-premades/icons/drakkenheim/entropic_flame_fire_form.webp";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(100);
    new Sequence()

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .mask()
        .filter("ColorMatrix", { hue: 180 })
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(workflow.token)
        .scaleToObject(1.8)
        .filter("ColorMatrix", { hue: 170 })

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(workflow.token)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 170 })

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
        if (mba.findEffect(target.actor, "Entropic Flame: Igniting Touch")) return;
        async function effectMacroTurnStart() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Entropic Flame: Igniting Touch");
            if (!effect) return;
            let choices = [["Yes (Spend Action)", "yes"], ["No (fire damage at the start of the next turn)", false]];
            let selection = await mbaPremades.helpers.dialog("Entropic Flame: Igniting Touch", choices, "Do you wish to douse the fire?");
            if (!selection) return;
            await mbaPremades.helpers.removeEffect(effect);
        }
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} EnFl IgT` })
        }
        const effectData = {
            'name': "Entropic Flame: Igniting Touch",
            'icon': "modules/mba-premades/icons/drakkenheim/entropic_flame_fire_form.webp",
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
            .filter("ColorMatrix", { hue: 180 })
            .waitUntilFinished(-2000)

            .effect()
            .file("animated-spell-effects-cartoon.fire.19")
            .attachTo(target)
            .scaleToObject(1.8)
            .filter("ColorMatrix", { hue: 170 })

            .effect()
            .file("animated-spell-effects-cartoon.fire.15")
            .attachTo(target)
            .scaleToObject(1.6)
            .mask()
            .playbackRate(0.9)
            .filter("ColorMatrix", { hue: 170 })

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
            .filter("ColorMatrix", { hue: 180 })
            .name(`${target.document.name} EnFl IgT`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let entropicFlame = {
    'hurlFlame': hurlFlame,
    'teleport': teleport,
    'touch': touch,
    'fireFormCast': fireFormCast,
    'fireFormItem': fireFormItem
}