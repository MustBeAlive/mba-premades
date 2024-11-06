import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do:
// Ghosts animation
// Tether?

async function paralyzingTouch({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "paralyzed")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} LichPT` });
    };
    let effectData = {
        'name': "Lich: Paralyzing Touch",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} by Lich's Paralyzing Touch for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=18, saveMagic=false, name=Paralysis: Turn End (DC18), killAnim=true',
                'priority': 20
            },
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
        .file("jb2a.markers.chain.spectral_standard.loop.02.purple")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .playbackRate(0.8)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 120 })
        .persist()
        .name(`${target.document.name} LichPT`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function legendaryCantrip({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Ray of Frost");
    if (!feature) {
        ui.notifications.warn("Unable to find item! (Ray of Frost)");
        return;
    }
    if (!workflow.targets.size) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function legendaryGazeCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
        .atLocation(workflow.token)
        .size(0.9, { gridUnits: true })
        .anchor({ x: 0.5, y: 0.5 })
        .duration(6000)
        .fadeIn(200)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
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
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
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
        .file("animated-spell-effects-cartoon.misc.fiery eyes.02")
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
    if (mba.checkTrait(target.actor, "ci", "frightened")) {
        ui.notifications.info("Target is immune to being Frightened!");
        return false;
    }
    if (mba.findEffect(target.actor, "Lich: Frightening Gaze Immunity")) {
        ui.notifications.info("Target is immune to being Lich's Frightening Gaze!");
        return false;
    }
}

async function legendaryGazeItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effectDataImmune = {
        'name': "Lich: Frightening Gaze Immunity",
        'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
        'description': `
            <p>You are immune to Lich's Frightening Gaze for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 86400
        }
    };
    async function effectMacroDel() {
        let effectDataImmune = {
            'name': "Lich: Frightening Gaze Immunity",
            'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
            'description': `
                <p>You are immune to Lich's Frightening Gaze for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    };
    let effectData = {
        'name': "Lich: Frightening Gaze",
        'icon': "modules/mba-premades/icons/generic/gaze_frightening.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Lich's Frightening Gaze for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
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
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=wis, saveDC=18, saveMagic=false, name=Fear: Turn End (DC18), killAnim=true',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (!workflow.failedSaves.size) await mba.createEffect(target.actor, effectDataImmune);
    else await mba.createEffect(target.actor, effectData);
}

async function legendaryDisruptLife({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let targets = [];
    for (let target of workflow.targets) if (mba.raceOrType(target.actor) != "undead") targets.push(target.id);
    mba.updateTargets(targets);
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.in.red.01")
        .attachTo(workflow.token)
        .scaleToObject(9, { considerTokenScale: true })
        .filter("ColorMatrix", { brightness: 0 })
        .randomRotation()
        .belowTokens()
        .zIndex(0.1)

        .effect()
        .file("jb2a.token_border.circle.static.purple.004")
        .attachTo(workflow.token)
        .opacity(0.6)
        .scaleToObject(1.7, { considerTokenScale: true })
        .fadeIn(500)
        .fadeOut(500)
        .duration(2500)
        .filter("ColorMatrix", { saturate: 0.5, hue: -5 })
        .tint("#e51e19")
        .belowTokens()
        .zIndex(2)

        .effect()
        .file(canvas.scene.background.src)
        .filter("ColorMatrix", { brightness: 0.3 })
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .duration(7000)
        .fadeIn(500)
        .fadeOut(1000)
        .belowTokens()

        .effect()
        .file(`jb2a.particles.outward.red.01.03`)
        .attachTo(workflow.token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .size(0.5 * workflow.token.document.width, { gridUnits: true })
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 20 })
        .zIndex(0.3)

        .effect()
        .file("jb2a.flames.04.complete.purple")
        .attachTo(workflow.token, { offset: { y: -0.35 }, gridUnits: true, followRotation: true })
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .tint("#e51e19")
        .fadeOut(500)
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .duration(2500)
        .zIndex(1)
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.impact.ground_crack.dark_red.01")
        .atLocation(workflow.token)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(7, { gridUnits: true })
        .tint("#e51e19")
        .zIndex(0.1)

        .canvasPan()
        .shake({ duration: 3000, strength: 2, rotation: false, fadeOut: 3000 })

        .effect()
        .file("jb2a.token_border.circle.static.purple.004")
        .attachTo(workflow.token)
        .opacity(0.6)
        .scaleToObject(1.7, { considerTokenScale: true })
        .fadeIn(250)
        .fadeOut(500)
        .duration(2500)
        .filter("ColorMatrix", { saturate: 0.5, hue: -5 })
        .tint("#e51e19")
        .zIndex(2)

        .effect()
        .file("jb2a.energy_strands.complete.dark_red.01")
        .attachTo(workflow.token)
        .scaleToObject(2, { considerTokenScale: true })
        .opacity(1)
        .filter("ColorMatrix", { brightness: 0 })
        .scaleIn(0, 1000, { ease: "easeOutBack" })
        .belowTokens()
        .zIndex(3)

        .effect()
        .file("jb2a.energy_strands.overlay.dark_red.01")
        .attachTo(workflow.token)
        .scaleToObject(2, { considerTokenScale: true })
        .filter("ColorMatrix", { brightness: 0 })
        .scaleIn(0, 1000, { ease: "easeOutBack" })
        .belowTokens()
        .zIndex(3)

        .effect()
        .file("jb2a.template_circle.aura.01.complete.small.bluepurple")
        .attachTo(workflow.token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(7.5, { gridUnits: true })
        .opacity(0.7)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 6500, { ease: "easeInSine" })
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })
        .tint("#e51e19")
        .randomRotation()
        .belowTokens()
        .zIndex(0.3)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(workflow.token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .opacity(0.65)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 6500, { ease: "easeInSine" })
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()
        .zIndex(0.2)
        .duration(2500)
        .fadeOut(2000)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(workflow.token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .opacity(0.7)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 6500, { ease: "easeInSine" })
        .filter("ColorMatrix", { brightness: 0 })
        .rotate(90)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000 })
        .belowTokens()
        .zIndex(0.3)
        .duration(2500)
        .fadeOut(2000)

        .effect()
        .file("jb2a.impact.003.dark_red")
        .attachTo(workflow.token, { offset: { y: 0.1 }, gridUnits: true, followRotation: true })
        .scaleToObject(1, { considerTokenScale: true })
        .zIndex(2)

        .play()
}

async function legendaryTouch({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Paralyzing Touch");
    if (!feature) {
        ui.notifications.warn("Unable to find item! (Paralyzing Touch)");
        return;
    }
    if (!workflow.targets.size) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function lairSlot({ speaker, actor, token, character, item, args, scope, workflow }) {
    let slotRoll = await new Roll("1d8").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(slotRoll);
    let slotLevel = slotRoll.total;
    let pathValue = `system.spells.spell${slotLevel}.value`;
    let pathMax = `system.spells.spell${slotLevel}.max`;
    let value = foundry.utils.getProperty(workflow.actor, pathValue);
    if (isNaN(value)) return;
    let max = foundry.utils.getProperty(workflow.actor, pathMax);
    if (isNaN(max)) return;
    if (value >= max) {
        ui.notifications.info(`Unable to recover ${slotLevel} level slot! (is max)`);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * workflow.token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .filter("ColorMatrix", { hue: 150 })
        .belowTokens()
        .zIndex(0)

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * workflow.token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .filter('ColorMatrix', { 'hue': 150 })
        .zIndex(1)

        .effect()
        .file("jb2a.particle_burst.01.rune.bluepurple")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .delay(2000)
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: 330 })
        .playbackRate(0.9)

        .wait(750)

        .thenDo(async () => {
            await workflow.actor.update({ [pathValue]: value + 1 });
        })

        .play()
}

async function lairTetherCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDelSource() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} LiTeth` });
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.lich?.tether?.targetUuid);
        if (!targetDoc) return;
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Lich Tether: Target");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': "Lich Tether: Source",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Target: <u>${target.document.name}</u></p>
        `,
        'duration': {
            'rounds': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.monsters.lich.lairTetherOnHit,preTargetDamageApplication',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['combatEnd', 'zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'lich': {
                        'tether': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            },
        }
    };
    async function effectMacroDelTarget() {
        let sourceDoc = await fromUuid(effect.flags['mba-premades']?.feature?.lich?.tether?.sourceUuid);
        if (!sourceDoc) return;
        let effectSource = await mbaPremades.helpers.findEffect(sourceDoc.actor, "Lich Tether: Source");
        if (effectSource) await mbaPremades.helpers.removeEffect(effectSource);
    };
    let effectDataTarget = {
        'name': "Lich Tether: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>A crackling cord of negative energy tethers from the Lich to you.</p>
            <p>Whenever the lich takes damage, you must make a DC 18 Constitution saving throw.</p>
            <p>On a failed save, the lich takes half the damage (rounded down), and you take the remaining damage.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'lich': {
                        'tether': {
                            'sourceUuid': workflow.token.document.uuid
                        }
                    }
                }
            },
        }
    };
    await new Sequence()

        .effect()
        .file(canvas.scene.background.src)
        .filter("ColorMatrix", { brightness: 0.7 })
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .duration(4500)
        .fadeIn(1500)
        .fadeOut(1500)
        .belowTokens()

        .effect()
        .file("jb2a.impact.012.dark_purple")
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .scaleToObject(1.8)
        .delay(500)
        .fadeIn(500)
        .repeats(3, 1100)

        .effect()
        .file("jb2a.witch_bolt.dark_purple")
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .stretchTo(target, { attachTo: true })
        .scaleIn(0, 1500, { ease: "easeOutExpo" })
        .delay(1500)
        .fadeOut(1000)
        .opacity(1)
        .persist()
        .name(`${workflow.token.document.name} LiTeth`)

        .effect()
        .file("jb2a.static_electricity.03.dark_purple")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(1500)
        .fadeIn(1000)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} LiTeth`)

        .wait(1500)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectDataSource);
            await mba.createEffect(target.actor, effectDataTarget);
        })

        .play()
}

// To do: понять, на что он тут плюётся
async function lairTetherOnHit(token, { item, workflow, ditem }) {
    if (ditem.appliedDamage == 0 || ditem.newHP == 0) return;
    let lichToken = token;
    let effect = mba.findEffect(lichToken.actor, "Lich Tether: Source");
    if (!effect) return;
    let tetherTokenUuid = effect.flags['mba-premades']?.feature?.lich?.tether?.targetUuid;
    if (!tetherTokenUuid) return;
    let queueSetup = await queue.setup(workflow.uuid, 'lichTether', 389);
    if (!queueSetup) return;

    let featureData1 = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Lich Tether: Save", false);
    if (!featureData1) {
        queue.remove(workflow.uuid);
        return;
    }
    let feature1 = new CONFIG.Item.documentClass(featureData1, { 'parent': lichToken.actor });
    let [config1, options1] = constants.syntheticItemWorkflowOptions([tetherTokenUuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature1, config1, options1);
    if (!featureWorkflow.failedSaves.size) {
        queue.remove(workflow.uuid);
        return;
    }

    let newDamage = Math.floor(ditem.appliedDamage / 2);
    if (newDamage <= 0) newDamage = 0;
    ditem.appliedDamage = newDamage;
    ditem.hpDamage = newDamage;
    ditem.newHP = ditem.oldHP - newDamage;
    let featureData2 = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Lich Tether: Damage Transfer", false);
    if (!featureData2) {
        queue.remove(workflow.uuid);
        return;
    }
    featureData2.system.damage.parts = [[ditem.appliedDamage + '[none]', 'none']];
    let feature2 = new CONFIG.Item.documentClass(featureData2, { 'parent': lichToken.actor });
    let [config2, options2] = constants.syntheticItemWorkflowOptions([tetherTokenUuid]);
    let damageWorkflow = await MidiQOL.completeItemUse(feature2, config2, options2);
    if (damageWorkflow.targets.first().actor.system.attributes.hp.value != 0) {
        queue.remove(workflow.uuid);
        return;
    }
    else {
        await mba.removeEffect(effect);
        queue.remove(workflow.uuid);
    }
}

async function lairGhosts({ speaker, actor, token, character, item, args, scope, workflow }) {
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
        .waitUntilFinished(500)

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
        .size(13, { gridUnits: true })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.25)
        .zIndex(0)
        .aboveLighting()
        .filter("ColorMatrix", { saturate: -1 })
        .repeats(8, 450, 450)

        .canvasPan()
        .delay(100)
        .shake({ duration: 3600, strength: 2, rotation: false, fadeOut: 1000 })

        .play()
}


export let lich = {
    'paralyzingTouch': paralyzingTouch,
    'legendaryCantrip': legendaryCantrip,
    'legendaryGazeCast': legendaryGazeCast,
    'legendaryGazeItemfrighteningGazeItem': legendaryGazeItem,
    'legendaryTouch': legendaryTouch,
    'legendaryDisruptLife': legendaryDisruptLife,
    'lairSlot': lairSlot,
    'lairTetherCast': lairTetherCast,
    'lairTetherOnHit': lairTetherOnHit,
    'lairGhosts': lairGhosts
}