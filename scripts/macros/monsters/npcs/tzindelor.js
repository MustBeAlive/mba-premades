import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// WIP

async function fireBreath({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.fire.orange.02")
        .attachTo(workflow.token)
        .stretchTo(template)

        .play()
}

async function frightfulPresenceCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targetIds = [];
    for (let target of Array.from(workflow.targets)) {
        if (mba.findEffect(target.actor, "Tzindelor: Frightful Presence Immune")) continue;
        if (mba.findEffect(target.actor, "Tzindelor: Frightful Presence")) continue;
        targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
    for (let target of Array.from(game.user.targets)) {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.01")
            .atLocation(workflow.token)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.01")
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
            .file("animated-spell-effects-cartoon.misc.fiery eyes.01")
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
            .file("animated-spell-effects-cartoon.misc.fiery eyes.01")
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

async function frightfulPresenceItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnEnd() {
        await mbaPremades.macros.monsters.tzindelor.frightfulPresenceTurnEnd(token);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} TziFea` });
        const effectDataImmune = {
            'name': "Tzindelor: Frightful Presence Immune",
            'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
            'description': `
                <p>You are immune to Tzindelor's Horrific Appearance for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            },
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    }
    let effectData = {
        'name': "Tzindelor: Frightful Presence",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Tzindelor's Frightful Presence for the duration.</p>
            <p>At the end of each of your turns, you can repeat the save.</p>
            <p>On a success, the effect ends and you become immune to the Tzindelor's Frightful Presence for the next 24 hours.</p>
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
            }
        }
    };
    let effectDataImmune = {
        'name': "Tzindelor: Frightful Presence Immune",
        'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
        'description': `
            <p>You are immune to Tzindelor's Horrific Appearance for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 86400
        },
    };
    if (workflow.saves.size) {
        for (let target of Array.from(workflow.saves)) await mba.createEffect(target.actor, effectDataImmune);
    }
    if (workflow.failedSaves.size) {
        for (let target of Array.from(workflow.failedSaves)) {
            new Sequence()

                .effect()
                .file("jb2a.icon.fear.dark_orange")
                .attachTo(target)
                .scaleToObject(1)
                .duration(2000)
                .fadeOut(1000)
                .scaleIn(0, 500, { ease: "easeOutQuint" })
                .playbackRate(1)

                .effect()
                .file("jb2a.icon.fear.dark_orange")
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
                .file("jb2a.markers.fear.dark_orange.03")
                .attachTo(target)
                .scaleToObject(2)
                .delay(500)
                .fadeIn(1000)
                .fadeOut(1000)
                .center()
                .playbackRate(1)
                .persist()
                .name(`${target.document.name} TziFea`)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                })

                .play()
        }
    }
}

async function frightfulPresenceTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Tzindelor: Frightful Presence");
    if (!effect) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Banshee Fear: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.img = "modules/mba-premades/icons/generic/gaze_frightening2.webp";
    featureData.name = "Tzindelor Fear: Save (DC 18)";
    featureData.system.save.dc = 18;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

// To do: find a way to dodge auto-reaction
async function legendaryMelee({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Bite (10 ft.)", "Bite"], ["Claw (5 ft.)", "Claw"]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Legendary Action: Melee Attack", choices, "<b>Select Attack:</b>");
    await mba.clearGMDialogMessage();
    if (!selection) {
        ui.notifications.warn("Unable to select attack! (try again, recover 1 LA");
        return;
    }
    let feature = await mba.getItem(workflow.actor, selection);
    if (!feature) {
        ui.notifications.warn(`Unable to find item! (${selection})`);
        return;
    }
    if (!workflow.targets.size) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function legendaryWingCast({ speaker, actor, token, character, item, args, scope, workflow }) {
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
        .file("jb2a.extras.tmfx.outpulse.circle.01.fast")
        .attachTo(workflow.token, { bindAlpha: false })
        .size(6, { gridUnits: true })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.5)
        .zIndex(0)
        .aboveLighting()
        .filter("ColorMatrix", { saturate: -1 })
        .repeats(4, 450, 450)

        .canvasPan()
        .delay(100)
        .shake({ duration: 2000, strength: 2, rotation: false, fadeOut: 2000 })

        .play()
}

async function legendaryWingItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.findEffect(target.actor, "Prone")) await mba.addCondition(target.actor, "Prone");
    }
}

async function lairEruption({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .belowTokens()

        .wait(500)

        .effect()
        .file("animated-spell-effects-cartoon.earth.crack")
        .atLocation(template)
        .scaleToObject(1)
        .fadeIn(750)
        .randomRotation()
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(template)
        .scaleToObject(1.5)

        .wait(200)

        .effect()
        .file("animated-spell-effects-cartoon.mix.fire earth explosion.04")
        .attachTo(template)
        .scaleToObject(1.5)

        .effect()
        .file("jb2a.eruption.orange.01")
        .attachTo(template)
        .scaleToObject(1.5)
        .delay(200)
        .fadeOut(1500)
        .belowTokens()
        .name("Eruption")

        .effect()
        .file("jb2a.scorched_earth.black")
        .attachTo(template)
        .scaleToObject(1.1)
        .delay(1500)
        .fadeIn(1500)
        .fadeOut(2000)
        .belowTokens()
        .persist()
        .name("Eruption")

        .play()
}

async function lairRocksCast({ speaker, actor, token, character, item, args, scope, workflow }) {
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
        .size(15, { gridUnits: true })
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

    let queueSetup = await queue.setup(workflow.item.uuid, 'lairRocks', 50);
    if (!queueSetup) return;
    let templateData = {
        't': 'rect',
        'user': game.user,
        'distance': 14.14,
        'direction': 45,
        'x': 3080,
        'y': 1680,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide"
            }
        },
        'width': 10,
        'angle': 0
    };
    let templateDoc = new CONFIG.MeasuredTemplate.documentClass(templateData, { 'parent': canvas.scene });
    let templates = [];
    ui.notifications.info("Place up to 12 templates. Right click to finish.");
    for (let i = 0; i < 15; i++) {
        let template = new game.dnd5e.canvas.AbilityTemplate(templateDoc);
        try {
            let [finalTemplate] = await template.drawPreview();
            templates.push(finalTemplate);
        } catch {/* empty */ }
        if (templates.length != i + 1) break;
    }
    if (!templates.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
    for (let i of templates) {
        let position = i.object.ray.project(0.5);
        new Sequence()

            .effect()
            .file("jaamod.misc.dust_fountain")
            .atLocation(position)
            .scaleToObject(2)
            .fadeIn(1000)
            .fadeOut(1000)
            .belowTokens()
            .persist()
            .name(`LaiRo`)

            .effect()
            .file("jb2a.impact.ground_crack.still_frame.03")
            .atLocation(position)
            .scaleToObject(2.5)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.5)
            .belowTokens()
            .persist()
            .name(`LaiRo`)

            .play();
    }
    async function effectMacroDel() {
        let templates = effect.flags["mba-premades"]?.feature?.lairRocks?.templates;
        if (!templates) return;
        for (let i of templates) {
            let template = await fromUuid(i);
            if (!template) continue;

            new Sequence()

                .thenDo(async () => {
                    Sequencer.EffectManager.endEffects({ name: `LaiRo` })
                })

                .effect()
                .file("jaamod.misc.dust_poof")
                .attachTo(template)
                .scaleToObject(2.5)
                .delay(700)
                .fadeOut(2500)
                .randomRotation()
                .belowTokens()

                .effect()
                .file("jb2a.falling_rocks.top.1x1.sandstone.1")
                .atLocation(template)
                .scaleToObject(2)
                .fadeOut(500)
                .randomRotation()
                .waitUntilFinished()

                .thenDo(async () => {
                    await template.delete();
                })

                .play()
        }
    }
    let effectData = {
        'name': "Lair: Rocks (Templates)",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Delete the effect on next lair action initiative (plays next animation).</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'lairRocks': {
                        'templates': templates.map(i => i.uuid)
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    queue.remove(workflow.item.uuid);
}

async function lairRocksDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    await mba.gmDialogMessage();
    let selection = await mba.selectTarget("Lair: Rocks", constants.yesNoButton, targets, false, 'multiple', undefined, false, '<b>Select creatures damaged by the rocks:</b>');
    await mba.clearGMDialogMessage();
    if (!selection.buttons) {
        ui.notifications.warn("Failed to select targets!");
        return;
    }
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
    let effect = await mba.findEffect(workflow.actor, "Lair: Rocks (Templates)");
    if (effect) await mba.removeEffect(effect);
}

async function lairTremorCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targetIds = [];
    for (let target of Array.from(workflow.targets)) {
        if (target.document.name === "Tzindelor") continue;
        if (target.document.elevation > 0) continue;
        if (mba.findEffect(target.actor, "Prone")) continue;
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
        .file("jb2a.particles.inward.orange.01.02")
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
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(workflow.token)
        .scaleToObject(4)
        .zIndex(1)
        .randomRotation()
        .belowTokens()

        .canvasPan()
        .delay(100)
        .shake({ duration: 2000, strength: 2.5, rotation: false, fadeOut: 5000 })

        .play()
}

async function lairTremorItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.findEffect(target.actor, "Prone")) await mba.addCondition(target.actor, "Prone");
        if (mba.findEffect(target.actor, "Concentrating")) await MidiQOL.doConcentrationCheck(target.actor, 16);
    }
}

export let tzindelor = {
    'fireBreath': fireBreath,
    'frightfulPresenceCast': frightfulPresenceCast,
    'frightfulPresenceItem': frightfulPresenceItem,
    'frightfulPresenceTurnEnd': frightfulPresenceTurnEnd,
    'legendaryMelee': legendaryMelee,
    'legendaryWingCast': legendaryWingCast,
    'legendaryWingItem': legendaryWingItem,
    'lairEruption': lairEruption,
    'lairRocksCast': lairRocksCast,
    'lairRocksDamage': lairRocksDamage,
    'lairTremorCast': lairTremorCast,
    'lairTremorItem': lairTremorItem,
}