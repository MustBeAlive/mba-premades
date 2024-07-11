import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 3;
    if (workflow.targets.size <= ammount) return;
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    mba.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroCreate() {
        await token.document.update({ hidden: true });
    };
    async function effectMacroEnd() {
        let choices = [["Home Plane (Stay there)", false], ["Demiplane (Return)", true]];
        await mbaPremades.helpers.playerDialogMessage();
        let selection = await mbaPremades.helpers.dialog("Banishment", choices, "<b></b>");
        await mbaPremades.helpers.clearPlayerDialogMessage();
        if (!selection) return;
        new Sequence()

            .effect()
            .file(canvas.scene.background.src)
            .filter("ColorMatrix", { brightness: 0.3 })
            .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
            .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
            .delay(1000)
            .duration(9000)
            .fadeIn(1500)
            .fadeOut(1500)
            .spriteOffset({ x: -0 }, { gridUnits: true })
            .belowTokens()

            .effect()
            .file("jb2a.particles.inward.blue.02.01")
            .atLocation(token)
            .delay(1000)
            .duration(3000)
            .fadeIn(1000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.energy_strands.in.blue.01.2")
            .atLocation(token)
            .scaleToObject(3.5)
            .delay(1500)
            .playbackRate(0.8)

            .effect()
            .file("jb2a.portals.horizontal.vortex.blue")
            .atLocation(token)
            .scaleToObject(2)
            .delay(2800)
            .fadeOut(1500)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .belowTokens()

            .wait(3500)

            .thenDo(async () => {
                await token.document.update({ hidden: false });
            })

            .play()
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You were banished from the material plane for the duration.</p>
            <p>If you are native to the plane of existence you're on, you are banished to a harmless demiplane. While there, you are incapacitated. You remain there until the spell ends, at which point you reappear in the space you left or in the nearest unoccupied space if that space is occupied.</p>
            <p>If you are native to a different plane of existence than the one you're on, you are banished with a faint popping noise, returning to your home plane. If the spell ends before 1 minute has passed, you reappear in the space you left or in the nearest unoccupied space if that space is occupied. Otherwise, you don't return.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroCreate)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroEnd)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.intro.dark_blue")
            .atLocation(target)
            .scaleToObject(2)
            .belowTokens()

            .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.loop.dark_blue")
            .atLocation(target)
            .scaleToObject(2)
            .belowTokens()
            .delay(3000)
            .duration(13000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(target, { offset: { x: 70, y: 22 } })
            .scaleToObject(0.5)
            .delay(3750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: -70, duration: 500, delay: 4000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 4000, ease: "easeInBack" })
            .duration(4500)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(target, { offset: { x: 45, y: -61 } })
            .scaleToObject(0.5)
            .delay(4250)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: -45, duration: 500, delay: 3500, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 3500, ease: "easeInBack" })
            .duration(4000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(target, { offset: { x: -45, y: -61 } })
            .scaleToObject(0.5)
            .delay(4750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 45, duration: 500, delay: 3000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 3000, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(3500)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(target, { offset: { x: -70, y: 22 } })
            .scaleToObject(0.5)
            .delay(5250)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 70, duration: 500, delay: 2500, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 2500, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(3000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(target, { offset: { x: 0, y: 75 } })
            .scaleToObject(0.5)
            .delay(5750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 0, duration: 500, delay: 2000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -150, duration: 500, delay: 2000, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(2500)

            .effect()
            .file("jb2a.explosion.01.blue")
            .atLocation(target, { offset: { x: 5, y: -75 } })
            .scaleToObject(1.5)
            .delay(8250)
            .zIndex(1)

            .effect()
            .file("jb2a.portals.vertical.vortex.blue")
            .atLocation(target, { offset: { x: 0, y: -75 } })
            .scaleToObject(2)
            .duration(6000)
            .scaleIn({ x: 0, y: 0.8 }, 500)
            .scaleOut({ x: 0, y: 0.4 }, 500, { ease: "easeInBack" })
            .fadeOut(250)
            .delay(8250)
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
            .file("jb2a.energy_beam.normal.bluepink.03") // check
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
            .file("jb2a.detect_magic.cone.blue")
            .rotateTowards(target)
            .atLocation(target, { offset: { x: 0, y: -110 } })
            .scaleToObject(1)
            .playbackRate(1.5)
            .zIndex(1)

            .effect()
            .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
            .atLocation(target, { offset: { x: 0, y: -75 } })
            .scaleToObject(1.75)
            .delay(1000)
            .fadeOut(1000)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.fireflies.many.02.blue")
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
}

export let banishment = {
    'cast': cast,
    'item': item
}