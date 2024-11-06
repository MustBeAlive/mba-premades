import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function horrifyingVisageCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = mba.findNearby(workflow.token, 60, "any", false, false, false, true);
    let targetIds = [];
    for (let target of targets) {
        if (mba.raceOrType(target.actor) === "undead") continue;
        if (mba.findEffect(target.actor, "Banshee: Horrifying Visage Immune")) continue;
        if (mba.findEffect(target.actor, "Banshee: Horrifying Visage")) continue;
        targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
    await warpgate.wait(100);
    for (let target of Array.from(game.user.targets)) {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(workflow.token)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(workflow.token)
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
            .atLocation(workflow.token)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(workflow.token)
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
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(workflow.token)
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
            .atLocation(workflow.token)
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
    }
}

async function horrifyingVisageItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnEnd() {
        await mbaPremades.macros.monsters.banshee.horrifyingVisageTurnEnd(token);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} BanFea` });
        let effectDataImmune = {
            'name': "Banshee: Horrifying Visage Immune",
            'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
            'description': `
                <p>You are immune to Banshee's Horrifying Visage for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            },
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    };
    let effectData = {
        'name': "Banshee: Horrifying Visage",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Banshee's Horrifying Visage for the duration.</p>
            <p>At the end of each of your turns, you can repeat the save, with disadvantage if the Banshee is within your line of sight.</p>
            <p>On a success, the effect ends and you become immune to the Banshee's Horrifying Visage for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Frightened",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'banshee': {
                        'fear': {
                            'originUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        }
    };
    let effectDataImmune = {
        'name': "Banshee: Horrifying Visage Immune",
        'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
        'description': `
            <p>You are immune to Banshee's Horrifying Visage for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 86400
        }
    };
    if (workflow.saves.size) {
        for (let target of Array.from(workflow.saves)) await mba.createEffect(target.actor, effectDataImmune);
    }
    if (workflow.failedSaves.size) {
        for (let target of Array.from(workflow.failedSaves)) {
            new Sequence()

                .effect()
                .file("jb2a.icon.fear.dark_purple")
                .attachTo(target)
                .scaleToObject(1)
                .duration(2000)
                .fadeOut(1000)
                .scaleIn(0, 500, { ease: "easeOutQuint" })
                .playbackRate(1)

                .effect()
                .file("jb2a.icon.fear.dark_purple")
                .attachTo(target)
                .scaleToObject(3)
                .fadeOut(1000)
                .duration(1000)
                .anchor({ y: 0.45 })
                .scaleIn(0, 500, { ease: "easeOutQuint" })
                .playbackRate(1)
                .opacity(0.5)

                .effect()
                .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
                .attachTo(target)
                .scaleToObject(2)

                .effect()
                .file("jb2a.markers.fear.dark_purple.03")
                .attachTo(target)
                .scaleToObject(2)
                .delay(500)
                .fadeIn(1000)
                .fadeOut(1000)
                .center()
                .playbackRate(1)
                .persist()
                .name(`${target.document.name} BanFea`)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                })

                .play()
        }
    }
}

async function horrifyingVisageTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Banshee: Horrifying Visage");
    if (!effect) return;
    let originUuid = effect.flags['mba-premades']?.feature?.banshee?.fear?.originUuid;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Banshee Fear: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Banshee Fear: Save (DC13)";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let [bansheeNearby] = await mba.findNearby(token, 200, "any", false, false, false, true).filter(t => t.document.uuid === originUuid); // To do: Fix?
    if (bansheeNearby) await mba.createEffect(token.actor, constants.disadvantageEffectData);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

async function wailCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Banshee: Wail", constants.yesNo, "<b>Is Banshee in the sunlight?</b>");
    await mba.clearGMDialogMessage();
    if (selection) return false;
}

async function wailCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = await mba.findNearby(workflow.token, 30, "any", false, false);
    if (!targets.length) return;
    let targetIds = [];
    for (let target of targets) {
        let type = await mba.raceOrType(target.actor);
        if (type === "undead" || type === "construct") continue;
        if (mba.findEffect(target.actor, "Deafened")) continue;
        targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1.75)
        .randomRotation()
        .fadeIn(1000, { delay: 0 })
        .opacity(1)
        .aboveLighting()

        .effect()
        .file("jb2a.particles.inward.white.01.02")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .duration(500)
        .fadeOut(400)
        .scaleOut(0, 750, { ease: "easeOutCubic" })
        .opacity(0.5)
        .zIndex(1)
        .randomRotation()
        .aboveLighting()
        .repeats(4, 150, 150)
        .waitUntilFinished()

        .effect()
        .file("jb2a.impact.004.blue")
        .atLocation(workflow.token)
        .scaleToObject(6)
        .fadeIn(700)
        .fadeOut(1000)
        .scaleIn(0, 3000, { ease: "easeOutExpo" })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.4)
        .zIndex(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.1 })
        .randomRotation()
        .aboveLighting()
        .repeats(8, 450, 450)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.01.fast")
        .attachTo(workflow.token, { bindAlpha: false })
        .size(12, { gridUnits: true })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.5)
        .zIndex(0)
        .aboveLighting()
        .filter("ColorMatrix", { saturate: -1 })
        .repeats(8, 450, 450)

        .canvasPan()
        .delay(100)
        .shake({ duration: 3600, strength: 2, rotation: false, fadeOut: 1000 })

        .play()
}

async function wailItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.saves.size) {
        let damageRoll = await new Roll("3d6[psychic]").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        await mba.applyWorkflowDamage(workflow.token, damageRoll, "psychic", Array.from(workflow.saves), "Banshee: Wail", workflow.itemCardId);
    }
    if (workflow.failedSaves.size);
    for (let target of Array.from(workflow.failedSaves)) {
        let currentHP = target.actor.system.attributes.hp.value;
        await mba.applyDamage([target], currentHP, "none");
    }
}

export let banshee = {
    'horrifyingVisageCast': horrifyingVisageCast,
    'horrifyingVisageItem': horrifyingVisageItem,
    'horrifyingVisageTurnEnd': horrifyingVisageTurnEnd,
    'wailCheck': wailCheck,
    'wailCast': wailCast,
    'wailItem': wailItem
}