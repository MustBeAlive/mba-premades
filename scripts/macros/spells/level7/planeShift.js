import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Teleport creatures to another plane", "teleport"], ["Banish Creature", "banish"]];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Plane Shift", choices, "What would you like to do?");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "teleport") {
        let targets = Array.from(workflow.targets);
        new Sequence()

            .effect()
            .file("jb2a.particles.outward.purple.01.05")
            .atLocation(workflow.token)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .scaleToObject(1.7)
            .fadeIn(3000, { ease: "easeInExpo" })
            .duration(5500)

            .effect()
            .file("jb2a.particles.outward.purple.01.05")
            .atLocation(workflow.token)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .scaleToObject(4)
            .belowTokens()
            .fadeIn(3000, { ease: "easeInExpo" })
            .duration(5500)

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.intro.purple")
            .atLocation(workflow.token)
            .belowTokens()
            .scaleToObject(3)
            .filter("ColorMatrix", { saturate: -0.25, brightness: 1 })
            .opacity(0.8)
            .waitUntilFinished(-500)

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.loop.purple")
            .atLocation(workflow.token)
            .filter("ColorMatrix", { saturate: -0.5, brightness: 1.5 })
            .opacity(0.65)
            .belowTokens()
            .scaleToObject(3)
            .duration(2500)

            .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.02.fast")
            .atLocation(workflow.token)
            .opacity(0.5)
            .scaleToObject(3)
            .duration(2500)

            .animation()
            .on(workflow.token)
            .delay(2000)
            .opacity(0)

            .thenDo(async () => {
                for (let target of targets) {
                    new Sequence()

                        .animation()
                        .on(target)
                        .delay(2000)
                        .opacity(0)

                        .effect()
                        .from(target)
                        .atLocation(target)
                        .scaleToObject(1.1)
                        .fadeIn(2000, { ease: "easeInExpo" })
                        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
                        .filter("Blur", { blurX: 5, blurY: 10 })
                        .scaleOut(0, 100, { ease: "easeOutCubic" })
                        .duration(2500)
                        .attachTo(target, { bindAlpha: false })
                        .waitUntilFinished(-200)

                        .play();
                }
            })

            .effect()
            .from(workflow.token)
            .atLocation(workflow.token)
            .scaleToObject(1.1)
            .fadeIn(2000, { ease: "easeInExpo" })
            .filter("ColorMatrix", { saturate: -1, brightness: 10 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .scaleOut(0, 100, { ease: "easeOutCubic" })
            .animateProperty("sprite", "scale.x", { from: 0.5, to: 0, duration: 500, delay: 2500, ease: "easeOutElastic" })
            .animateProperty("spriteContainer", "position.y", { from: 0, to: -1000, duration: 500, delay: 2500, ease: "easeOutCubic" })
            .fadeOut(100)
            .duration(2500 + 500)
            .attachTo(workflow.token, { bindAlpha: false })
            .waitUntilFinished(-700)

            .effect()
            .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/energy/energy_pulse_yellow_CIRCLE.webm")
            .atLocation(workflow.token)
            .opacity(1)
            .scaleToObject(4)
            .filter("ColorMatrix", { saturate: -1, hue: 160, brightness: 2 })

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.loop.purple")
            .atLocation(workflow.token)
            .filter("ColorMatrix", { saturate: -1, brightness: 0 })
            .opacity(0.3)
            .fadeOut(10000, { ease: "easeOutQuint" })
            .belowTokens()
            .scaleToObject(3)
            .duration(20000)

            .effect()
            .file("jb2a.particles.outward.purple.01.05")
            .atLocation(workflow.token)
            .fadeIn(250, { ease: "easeOutQuint" })
            .fadeOut(5000, { ease: "easeOutQuint" })
            .opacity(1)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .scaleToObject(5)
            .duration(10000)

            .play()
    }
    else if (selection === "banish") {
        await banishment({ speaker, actor, token, character, item, args, scope, workflow });
    }
}

async function banishment({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) {
        ui.notifications.warn("No target specified!");
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Plane Shift: Banishment", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    featureData.system.attackBonus = workflow.actor.system.attributes.prof;
    setProperty(featureData, "mba-premades.spell.castData.school", workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.hitTargets.size || !featureWorkflow.failedSaves.size) return;
    async function effectMacroCreate() {
        await token.document.update({ hidden: true });
    };
    async function effectMacroDel() {
        await token.document.update({ hidden: false });
    };
    let effectData = {
        'name': "Plane Shift: Banishment",
        'icon': "modules/mba-premades/icons/spells/level7/plane_shift_banishment.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You were banished from the material plane.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroCreate)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.abjuration.intro.dark_purple")
        .atLocation(target)
        .scaleToObject(2)
        .playbackRate(2)
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.circle.02.abjuration.loop.dark_purple")
        .atLocation(target)
        .scaleToObject(2)
        .belowTokens()
        .delay(1000)
        .duration(10000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.purple")
        .atLocation(target, { offset: { x: 70, y: 22 } })
        .scaleToObject(0.5)
        .delay(1000)
        .playbackRate(0.65)
        .animateProperty("sprite", "position.x", { from: 0, to: -70, duration: 500, delay: 1500, ease: "easeInBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 1500, ease: "easeInBack" })
        .duration(4500)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.purple")
        .atLocation(target, { offset: { x: 45, y: -61 } })
        .scaleToObject(0.5)
        .delay(1000)
        .playbackRate(0.65)
        .animateProperty("sprite", "position.x", { from: 0, to: -45, duration: 500, delay: 1500, ease: "easeInBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 1500, ease: "easeInBack" })
        .duration(4000)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.purple")
        .atLocation(target, { offset: { x: -45, y: -61 } })
        .scaleToObject(0.5)
        .delay(1000)
        .playbackRate(0.65)
        .animateProperty("sprite", "position.x", { from: 0, to: 45, duration: 500, delay: 1500, ease: "easeInBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 1500, ease: "easeInBack" })
        .zIndex(0.9)
        .duration(3500)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.purple")
        .atLocation(target, { offset: { x: -70, y: 22 } })
        .scaleToObject(0.5)
        .delay(1000)
        .playbackRate(0.65)
        .animateProperty("sprite", "position.x", { from: 0, to: 70, duration: 500, delay: 1500, ease: "easeInBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 1500, ease: "easeInBack" })
        .zIndex(0.9)
        .duration(3000)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.purple")
        .atLocation(target, { offset: { x: 0, y: 75 } })
        .scaleToObject(0.5)
        .delay(1000)
        .playbackRate(0.65)
        .animateProperty("sprite", "position.x", { from: 0, to: 0, duration: 500, delay: 1500, ease: "easeInBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -150, duration: 500, delay: 1500, ease: "easeInBack" })
        .zIndex(0.9)
        .duration(2500)

        .effect()
        .file("jb2a.explosion.01.purple")
        .atLocation(target, { offset: { x: 5, y: -75 } })
        .scaleToObject(1.5)
        .delay(3000)
        .zIndex(1)

        .effect()
        .file("jb2a.portals.vertical.vortex.purple")
        .atLocation(target, { offset: { x: 0, y: -75 } })
        .scaleToObject(2)
        .delay(3000)
        .duration(6000)
        .scaleIn({ x: 0, y: 0.8 }, 500)
        .scaleOut({ x: 0, y: 0.4 }, 500, { ease: "easeInBack" })
        .fadeOut(250)
        .zIndex(0.7)
        .belowTokens()
        .waitUntilFinished(-5750)

        .effect()
        .file("jb2a.wind_stream.1200.white")
        .atLocation(target)
        .scaleToObject(1.03)
        .rotate(90)
        .duration(6000)
        .fadeIn(250)
        .fadeOut(750)

        .effect()
        .file("jb2a.wind_stream.1200.white")
        .atLocation(target, { offset: { x: 0, y: 100 } })
        .scaleToObject(1.03)
        .rotate(90)
        .duration(6000)
        .fadeIn(250)
        .fadeOut(750)

        .effect()
        .file("jb2a.energy_beam.normal.dark_purplered.03")
        .atLocation(target, { offset: { x: 0, y: 50 } })
        .rotate(90)
        .size({ width: 400, height: 350 })
        .opacity(0.2)
        .duration(6000)
        .playbackRate(1.6)
        .fadeIn(250)
        .fadeOut(750)

        .animation()
        .on(target)
        .opacity(0)
        .waitUntilFinished(-500)

        .effect()
        .from(target)
        .atLocation(target)
        .animateProperty("sprite", "position.y", { from: 0, to: -15, duration: 250, ease: "easeInOutBack" })
        .waitUntilFinished(-100)

        .effect()
        .from(target)
        .atLocation(target)
        .animateProperty("sprite", "position.y", { from: -15, to: 0, duration: 2000, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: 8, duration: 500, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 500, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 16, duration: 500, delay: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 1500, ease: "easeInCubic" })
        .waitUntilFinished(-100)

        .effect()
        .from(target)
        .atLocation(target)
        .animateProperty("sprite", "position.y", { from: 0, to: -40, duration: 500, ease: "easeInOutBack" })
        .waitUntilFinished(-100)

        .effect()
        .from(target)
        .atLocation(target)
        .animateProperty("sprite", "position.y", { from: -40, to: -15, duration: 2000, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: 8, duration: 500, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 500, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 16, duration: 500, delay: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 1500, ease: "easeInCubic" })
        .waitUntilFinished(-100)

        .effect()
        .from(target)
        .atLocation(target)
        .animateProperty("sprite", "position.y", { from: -15, to: -200, duration: 750, ease: "easeInOutBack" })
        .scaleOut(0, 750)
        .duration(375)
        .waitUntilFinished(-150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("animated-spell-effects-cartoon.flash.01")
        .atLocation(target, { offset: { x: 0, y: -85 } })
        .scaleToObject(0.5)
        .filter("ColorMatrix", { hue: 15 })
        .zIndex(0.9)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .rotateTowards(target)
        .atLocation(target, { offset: { x: 0, y: -110 } })
        .scaleToObject(1)
        .playbackRate(1.5)
        .zIndex(1)

        .effect()
        .file("jb2a.template_circle.out_pulse.02.loop.purplepink")
        .atLocation(target, { offset: { x: 0, y: -75 } })
        .scaleToObject(1.75)
        .delay(1000)
        .fadeOut(1000)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.fireflies.many.02.purple")
        .atLocation(target, { offset: { x: 0, y: -75 } })
        .scaleToObject(0.75)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(750)
        .animateProperty("sprite", "position.y", { from: 0, to: 75, duration: 3000 })

        .animation()
        .on(target)
        .opacity(1)

        .play();
}

export let planeShift = {
    'item': item,
    'banishment': banishment
}