import {mba} from "../../../helperFunctions.js";

export async function speakWithDead({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, 'Dead')) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    if (mba.raceOrType(target.actor) === 'undead') {
        ui.notifications.warn("Unable to speak with target! (Target is undead)");
        return;
    }
    let options = [["Yes, proceed", "yes"], ["No, deny Speak with Dead", "no"]];
    let selection = await mba.remoteDialog(workflow.item.name, options, game.users.activeGM.id, `Is <b>${target.document.name}</b> eligible to use Speak with Dead on?`);
    if (!selection || selection === "no") {
        ui.notifications.info("GM has denied your request. Sorry!");
        return;
    }
    async function effectMacroCreate() {
        let effect = await mbaPremades.helpers.findEffect(actor, 'Speak with Dead');
        if (!effect) return;
        let count = 5;
        for (let i = 0; i != count;) {
            await new Promise((resolve) => {
                new Dialog({
                    title: `Questions Count`,
                    content: `<p>This is a QoL counter for GM to track questions.</p><p>Questions left: <b>${count}</b></p>`,
                    buttons: {
                        plus: {
                            label: "Press when question is answered",
                            callback: async (html) => {
                                count -= 1;
                                resolve(count);
                            },
                        }
                    },
                    default: "plus"
                }).render(true);
            });
        };
        await mbaPremades.helpers.removeEffect(effect);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Speak with Dead` });

        new Sequence()

            .effect()
            .from(token)
            .attachTo(token, { bindAlpha: false, followRotation: false })
            .scaleToObject(1, { considerTokenScale: true })
            .animateProperty("spriteContainer", "position.y", { from: -0.2, to: 0, duration: 2000, gridUnits: true, ease: "easeInSine" })
            .zIndex(0.2)
            .waitUntilFinished()

            .thenDo(async () => {
                await mbaPremades.helpers.addCondition(actor, 'Dead', true)
            })

            .animation()
            .on(token)
            .opacity(1)

            .play();
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'flags': {
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
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .atLocation(target)
        .file(`jb2a.magic_signs.circle.02.necromancy.loop.blue`)
        .scaleToObject(1.25)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: -65 })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 60000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .atLocation(target)
        .file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
        .scaleToObject(1.25)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 5 })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 60000 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .wait(500)

        //Bottom Right Flame
        .effect()
        .atLocation(target, { offset: { x: 0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .atLocation(target, { offset: { x: 0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(250)
        .atLocation(target, { offset: { x: 0.5, y: 0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        //Bottom Left Flame
        .effect()
        .atLocation(target, { offset: { x: -0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .atLocation(target, { offset: { x: -0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(250)
        .atLocation(target, { offset: { x: -0.5, y: 0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        //Top Left Flame
        .effect()
        .atLocation(target, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .atLocation(target, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(250)
        .atLocation(target, { offset: { x: -0.5, y: -0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        //Top Right Flame
        .effect()
        .atLocation(target, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .atLocation(target, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(250)
        .atLocation(target, { offset: { x: 0.5, y: -0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .fadeOut(500)
        .zIndex(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .play()

    //Token effect
    new Sequence()

        .wait(1000)

        .effect()
        .file("animated-spell-effects-cartoon.magic.mind sliver")
        .atLocation(target, { offset: { y: -0.75 * target.document.width }, gridUnits: true })
        .scaleToObject(2)
        .rotate(-90)
        .filter("ColorMatrix", { hue: -65 })
        .fadeIn(250)
        .filter("Blur", { blurX: 1, blurY: 50 })
        .zIndex(2)

        .effect()
        .delay(100)
        .file("jb2a.particles.outward.blue.01.03")
        .atLocation(target)
        .scaleToObject(1.1)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.75, duration: 500, ease: "easeOutCubic", gridUnits: true })
        .animateProperty("sprite", "width", { from: 1, to: 0.5, duration: 100, ease: "easeOutCubic", gridUnits: true })
        .animateProperty("sprite", "height", { from: 1, to: 1.5, duration: 500, ease: "easeOutCubic", gridUnits: true })
        .fadeOut(500)
        .duration(500)
        .zIndex(2)

        .effect()
        .delay(100)
        .file("jb2a.detect_magic.circle.blue")
        .atLocation(target)
        .scaleToObject(1.25)
        .filter("ColorMatrix", { hue: -65 })
        .fadeOut(3500)
        .zIndex(1.5)

        .animation()
        .delay(200)
        .on(target)
        .opacity(0)

        .effect()
        .file("jb2a.token_border.circle.static.blue.012")
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(1.85, { considerTokenScale: true })
        .fadeIn(4000)
        .fadeOut(500)
        .opacity(0.5)
        .filter("ColorMatrix", { hue: -65 })
        .zIndex(1.1)
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.2, duration: 2000, delay: 2000, gridUnits: true, ease: "easeInSine" })
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 4000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(100)
        .from(target)
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(0.95, { considerTokenScale: true })
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1.1)
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(2000)
        .file("jb2a.spirit_guardians.blue.spirits")
        .attachTo(target, { offset: { y: 0 }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(1.35, { considerTokenScale: true })
        .filter("ColorMatrix", { hue: -65 })
        .opacity(0.65)
        .fadeIn(1000)
        .fadeOut(500)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(3000)
        .file("jb2a.magic_signs.rune.necromancy.complete.blue")
        .attachTo(target, { offset: { y: -0.77 * target.document.width }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(0.4, { considerTokenScale: true })
        .filter("ColorMatrix", { hue: -65 })
        .opacity(1)
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 1000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .zIndex(2)
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(3000)
        .file("jb2a.magic_signs.rune.necromancy.complete.blue")
        .attachTo(target, { offset: { y: -0.55 * target.document.width }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(0.4, { considerTokenScale: true })
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(2)
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .effect()
        .delay(100)
        .from(target)
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(1, { considerTokenScale: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.2, duration: 2000, delay: 2000, gridUnits: true, ease: "easeInSine" })
        .animateProperty("sprite", "rotation", { from: 0, to: 15, duration: 1000, delay: 2500, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: -15, duration: 1000, delay: 3000, ease: "easeInOutBack" })
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 4000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .zIndex(0.2)
        .fadeOut(500)
        .persist()
        .name(`${target.document.name} Speak with Dead`)

        .wait(4000)

        .thenDo(async () => {
            await mba.removeCondition(target.actor, 'Dead');
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}