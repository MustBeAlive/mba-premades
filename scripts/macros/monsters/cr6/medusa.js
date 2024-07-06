import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do: overlap issue

async function petrifyingGazeTrigger(actor, token) {
    if (!mba.inCombat()) return;
    if (mba.findEffect(actor, "Incapacitated")) return;
    let tokenId = game.combat.current.tokenId;
    let [target] = await mba.findNearby(token, 30, null, false, false).filter(i => i.document.id === tokenId && i.document.name != "Medusa");
    if (!target) return;
    if (mba.checkTrait(target.actor, "ci", "petrified")) return;
    if (mba.findEffect(target.actor, "Petrified")) return; // just overly cautious
    if (mba.findEffect(target.actor, "Medusa: Petrifying Gaze")) return;
    if (mba.findEffect(target.actor, "Medusa: Petrification")) return;
    let choices = [["<u>Avert Eyes</u> (inability to attack Medusa)", "avert"], ["<u>Embrace Petrifying Gaze</u> (saving throw)", "save"]];
    let selection = await mba.remoteDialog("Medusa: Petrifying Gaze", choices, mba.firstOwner(target).id, `<p>You are about to be affected by</p><p><u>Medusa's Petrifying Gaze</u></p><p>What would you like to do?</p>`);
    if (!selection) selection = "save";
    if (selection === "avert") {
        const effectDataAvert = {
            'name': "Medusa: Avert Eyes",
            'icon': "modules/mba-premades/icons/conditions/avert_eyes.webp",
            'description': `
                <p>You averted your eyes to escape the effect of Medusa's Petrifying Gaze.</p>
                <p>You can't see the medusa until the start of your next turn, when you can avert your eyes again.</p>
                <p>If you look at the medusa in the meantime, you must immediately make the save.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.monsters.medusa.avertEyes,preItemRoll',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStart']
                }
            }
        };
        if (!mba.findEffect(target.actor, "Medusa: Avert Eyes")) await mba.createEffect(target.actor, effectDataAvert);
        return;
    }
    if (mba.findEffect(target.actor, "Medusa: Avert Eyes")) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Medusa: Petrifying Gaze', false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
        .atLocation(token)
        .size(0.9, { gridUnits: true })
        .anchor({ x: 0.5, y: 0.5 })
        .duration(6000)
        .fadeIn(200)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
        .atLocation(token)
        .size(0.9, { gridUnits: true })
        .anchor({ x: 0.5, y: 0.5 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .duration(6000)
        .fadeIn(200)
        .fadeOut(500)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(token)
        .belowTokens()
        .opacity(0.25)
        .size(3, { gridUnits: true })
        .duration(5000)
        .fadeIn(1000)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
        .atLocation(token)
        .scale({ x: 0.1, y: 1.25 })
        .anchor({ x: 0.5, y: 0.35 })
        .opacity(0.5)
        .rotate(90)
        .rotateTowards(target)
        .belowTokens()
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
        .atLocation(token)
        .scale({ x: 0.1, y: 1.25 })
        .anchor({ x: 0.5, y: 0.35 })
        .opacity(0.2)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .rotate(90)
        .rotateTowards(target)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)

        .effect()
        .file("jb2a.wind_stream.white")
        .atLocation(token)
        .stretchTo(target, { onlyX: false })
        .filter("Blur", { blurX: 10, blurY: 20 })
        .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 100, pingPong: true })
        .opacity(0.3)

        .effect()
        .from(target)
        .attachTo(target)
        .fadeIn(100)
        .fadeOut(1000)
        .playbackRate(4)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .opacity(0.15)
        .zIndex(0.1)

        .play()

    await MidiQOL.completeItemUse(feature, config, options);
}

async function petrifyingGazeItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "con");
        if (saveRoll.total >= 14) return;
        async function effectMacroDel() {
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Medusa Petrification`, object: token })
        }
        const effectData = {
            'name': "Medusa: Petrification",
            'icon': "modules/mba-premades/icons/conditions/muddy.webp",
            'description': "You failed second saving throw and have turned into stone.",
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Petrified",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .from(token)
            .atLocation(token)
            .mask(token)
            .opacity(0.4)
            .filter("ColorMatrix", { contrast: 1, saturate: -1 })
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .attachTo(token)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .zIndex(1)
            .persist()
            .name(`${token.document.name} Medusa Petrification`)

            .effect()
            .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
            .atLocation(token)
            .mask(token)
            .opacity(1)
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .zIndex(0)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .attachTo(token)
            .persist()
            .name(`${token.document.name} Medusa Petrification`)

            .play()

        await mbaPremades.helpers.createEffect(actor, effectData);
    };
    const effectData = {
        'name': "Medusa: Petrifying Gaze",
        'icon': "modules/mba-premades/icons/conditions/muddy.webp",
        'description': `
            <p>You are restrained as you begin to magically turn into stone.</p>
            <p>At the end of your next turn you must repeat the saving throw.</p>
            <p>On a success, the effect ends. On a failure, you are petrified.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.createEffect(workflow.targets.first().actor, effectData);
}


async function avertEyes({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    for (let target of workflow.targets) {
        if (target.document.name != "Medusa") continue;
        let choices = [["Keep averting eyes (cancel)", "avert"], ["Fuck it, we <b>Ball</b> (save)", "save"]];
        let selection = await mba.dialog("Medusa: Petrifying Gaze", choices, "<b>You are going to look at Medusa</b>");
        if (!selection) selection = "save";
        if (selection === "avert") return false;
        let effect = await mba.findEffect(workflow.actor, "Medusa: Avert Eyes");
        if (effect) await mba.removeEffect(effect);
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Medusa: Petrifying Gaze', false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': target.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .opacity(1)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.02")
            .atLocation(target)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.5)
            .rotate(90)
            .rotateTowards(token)
            .belowTokens()
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.2)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .rotate(90)
            .rotateTowards(token)
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("jb2a.wind_stream.white")
            .atLocation(target)
            .stretchTo(token, { onlyX: false })
            .filter("Blur", { blurX: 10, blurY: 20 })
            .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 100, pingPong: true })
            .opacity(0.3)

            .effect()
            .from(token)
            .attachTo(token)
            .fadeIn(100)
            .fadeOut(1000)
            .playbackRate(4)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
            .scaleToObject(1, { considerTokenScale: true })
            .duration(5000)
            .opacity(0.15)
            .zIndex(0.1)

            .play()

        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (featureWorkflow.failedSaves.size) return false;
    }
}

export let medusa = {
    'petrifyingGazeTrigger': petrifyingGazeTrigger,
    'petrifyingGazeItem': petrifyingGazeItem,
    'avertEyes': avertEyes
}