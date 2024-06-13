import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function turnUndead({ speaker, actor, token, character, item, args, scope, workflow }) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.info("You don't have any Channel Divinity uses left!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let validTargets = [];
    for (let i of Array.from(workflow.targets)) {
        if (mba.raceOrType(i.actor) != 'undead') continue;
        if (i.actor.system.attributes.hp.value === 0) continue;
        if (i.actor.flags['mba-premades']?.feature?.turnResistance) await mba.createEffect(i.actor, constants.advantageEffectData);
        if (i.actor.flags['mba-premades']?.feature?.turnImmunity) await mba.createEffect(i.actor, constants.immunityEffectData);
        validTargets.push(i.document.uuid);
    }
    mba.updateTargets(validTargets);
    await warpgate.wait(100);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Turn Undead: Save');
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Turn Undead: Save)")
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(validTargets);
    await game.messages.get(workflow.itemCardId).delete();
    uses -= 1;
    await CDItem.update({ "system.uses.value": uses });
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.in.red.01.2")
        .attachTo(token)
        .scaleToObject(9, { considerTokenScale: true })
        .filter("ColorMatrix", { hue: 60 })
        .randomRotation()
        .belowTokens()
        .zIndex(0.1)

        .effect()
        .file("jb2a.token_border.circle.static.blue.001")
        .attachTo(token)
        .scaleToObject(2.1, { considerTokenScale: true })
        .duration(2500)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.6)
        .filter("ColorMatrix", { hue: 220 })
        .belowTokens()
        .zIndex(2)
        .name("Turn Undead 1")
        .waitUntilFinished(-500)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(7000)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { brightness: 1.5 })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .belowTokens()

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .size(0.5 * token.document.width, { gridUnits: true })
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 30 })
        .zIndex(0.3)

        .effect()
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(token)
        .size(7, { gridUnits: true })
        .belowTokens()
        .filter("ColorMatrix", { hue: 20, saturate: 1 })
        .tint("#e6c419")
        .zIndex(0.1)

        .canvasPan()
        .shake({ duration: 3000, strength: 2, rotation: false, fadeOut: 3000 })

        .effect()
        .file("jb2a.token_border.circle.static.orange.004")
        .attachTo(token)
        .scaleToObject(1.7, { considerTokenScale: true })
        .duration(2500)
        .fadeIn(250)
        .fadeOut(500)
        .opacity(0.6)
        .filter("ColorMatrix", { saturate: 0.5, hue: 30 })
        .tint("#e6c419")
        .zIndex(2)
        .name("Turn Undead 2")

        .effect()
        .file("jb2a.markers.light_orb.loop.yellow")
        .attachTo(token)
        .scaleToObject(3, { considerTokenScale: true })
        .scaleIn(0, 1000, { ease: "easeOutBack" })
        .duration(10000)
        .fadeOut(1000)
        .zIndex(3)
        .name("Turn Undead 3")

        .effect()
        .file("jb2a.markers.light.loop.yellow02")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(10, { gridUnits: true })
        .duration(10000)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .randomRotation()
        .belowTokens()
        .zIndex(1)
        .name("Turn Undead 4")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .duration(10000)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .opacity(0.65)
        .filter("ColorMatrix", { brightness: 1 })
        .belowTokens()
        .zIndex(0.2)
        .name("Turn Undead 5")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .duration(10000)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .opacity(0.7)
        .filter("ColorMatrix", { brightness: 1 })
        .rotate(90)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000 })
        .belowTokens()
        .zIndex(0.3)
        .name("Turn Undead 6")

        .effect()
        .file("jb2a.impact.003.yellow")
        .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: true })
        .scaleToObject(1, { considerTokenScale: true })
        .zIndex(2)

        .play()

    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroTurnStart() {
        let reaction = await mbaPremades.helpers.findEffect(actor, "Reaction");
        if (!reaction) await mbaPremades.helpers.addCondition(actor, "Reaction");
        let effect = await mbaPremades.helpers.findEffect(actor, "Turn Undead: Turned");
        if (!effect) return;
        let name = effect.flags['mba-premades']?.feature?.turnUndead?.name;
        await mbaPremades.helpers.dialog("Turn Undead: Turned", [["Gotcha", "ok"]], `
            <p>You are turned from <b>${name}</b> by Divine Power for the duration, or until you take any damage.</p>
            <p>You must spend your turns trying to move as far away from <b>${name}</b> as you can, and you can't willingly move to a space within 30 feet of <b>${name}</b>.</p>
            <p>Also, you <b>can't take reactions</b>. For your action, you can use only the <b>Dash action</b> or try to escape from an effect that prevents you from moving.</p>
            <p>If there's nowhere to move, you can use the <b>Dodge action</b>.</p>
        `);
    };
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Turn Undead`, object: token })
    };
    const effectData = {
        'name': "Turn Undead: Turned",
        'icon': "modules/mba-premades/icons/conditions/turned.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are turned from <b>${workflow.token.document.name}</b> by Divine Power for the duration, or until you take any damage.</p>
            <p>You must spend your turns trying to move as far away from <b>${workflow.token.document.name}</b> as you can, and you can't willingly move to a space within 30 feet of <b>${workflow.token.document.name}</b>.</p>
            <p>Also, you <b>can't take reactions</b>. For your action, you can use only the <b>Dash action</b> or try to escape from an effect that prevents you from moving.</p>
            <p>If there's nowhere to move, you can use the <b>Dodge action</b>.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [

        ],
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'turnUndead': {
                        'name': workflow.token.document.name
                    }
                }
            }
        }
    };
    let clericLevels = workflow.actor.classes['cleric']?.system?.levels;
    if (!clericLevels) {
        ui.notifications.warn("Unable to find cleric levels!");
        return;
    }
    let destroyLevel = 0;
    if (clericLevels >= 17) destroyLevel = 4;
    else if (clericLevels >= 14) destroyLevel = 3;
    else if (clericLevels >= 11) destroyLevel = 2;
    else if (clericLevels >= 8) destroyLevel = 1;
    else if (clericLevels >= 5) destroyLevel = 0.5;
    let effectTargets = []
    let destroyTargets = [];
    for (let target of featureWorkflow.failedSaves) {
        let CR = mba.levelOrCR(target.actor);
        if (!CR) continue;
        if (CR <= destroyLevel) {
            destroyTargets.push(target);
            continue;
        } else {
            effectTargets.push(target)
            continue;
        }
    }
    if (effectTargets.length) {
        for (let target of effectTargets) {
            new Sequence()

                .effect()
                .file("jb2a.divine_smite.caster.reversed.yellowwhite")
                .attachTo(target)
                .scaleToObject(1.85)
                .waitUntilFinished(-1400)

                .effect()
                .file("jb2a.token_border.circle.static.blue.003")
                .attachTo(target)
                .scaleToObject(1.9 * target.document.texture.scaleX)
                .fadeIn(500)
                .fadeOut(1000)
                .opacity(0.7)
                .filter("ColorMatrix", { hue: 220 })
                .mask()
                .persist()
                .name(`${target.document.name} Turn Undead`)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                    if (!mba.findEffect(target.actor, "Reaction")) await mba.addCondition(target.actor, "Reaction");
                })

                .play()
        }
    }
    if (destroyTargets.length) {
        for (let target of destroyTargets) {
            new Sequence()

                .effect()
                .file('jb2a.divine_smite.target.blueyellow')
                .atLocation(target)
                .scaleToObject(3)

                .play();
        }
        await mba.applyDamage(destroyTargets, '10000', 'none');
    }
}