//Animation by EskieMoh#2969
export async function speakWithDead({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let isDead = await chrisPremades.helpers.findEffect(target.actor, 'Dead');
    if (!isDead) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    let type = await chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead') {
        ui.notifications.warn("Unable to speak with target! (Target is undead)");
        return;
    }
    async function effectMacroCreate() {
        let effect = await chrisPremades.helpers.findEffect(actor, 'Speak with Dead');
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
        await chrisPremades.helpers.removeEffect(effect);
    }
    async function effectMacroDel() {
        if (Tagger.hasTags(token, "SpeakWithDead")) {
            await token.document.update({ hidden: true });
            Tagger.removeTags(token, "SpeakWithDead");
            Sequencer.EffectManager.endEffects({ name: `Speak With Dead` });   
            
            new Sequence()
                .animation()
                .on(token)
                .opacity(1)
                
                .effect()
                .from(token)
                .attachTo(token, { bindAlpha: false, followRotation: false })
                .scaleToObject(1, { considerTokenScale: true })
                .animateProperty("spriteContainer", "position.y", { from: -0.2, to: 0, duration: 2000, gridUnits: true, ease: "easeInSine" })
                .zIndex(0.2)
                .waitUntilFinished()

            	.thenDo(function () {
                    token.document.update({ hidden: false});
                    chrisPremades.helpers.addCondition(actor, 'Dead', true)
                })
                .play();
        }
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
                    'script': chrisPremades.helpers.functionToString(effectMacroCreate)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
    await Tagger.addTags(target, "SpeakWithDead");
    //Magic Circle Effect
    new Sequence()

        .effect()
        .name("Speak With Dead")
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
        .name("Speak With Dead")
        .atLocation(target, { offset: { x: 0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(250)
        .atLocation(target, { offset: { x: 0.5, y: 0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .zIndex(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        //Bottom Left Flame
        .effect()
        .atLocation(target, { offset: { x: -0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .name("Speak With Dead")
        .atLocation(target, { offset: { x: -0.5, y: 0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(250)
        .atLocation(target, { offset: { x: -0.5, y: 0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .zIndex(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        //Top Left Flame
        .effect()
        .atLocation(target, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .name("Speak With Dead")
        .atLocation(target, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(250)
        .atLocation(target, { offset: { x: -0.5, y: -0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .zIndex(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        //Top Right Flame
        .effect()
        .atLocation(target, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.impact.008.blue")
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(1)
        .zIndex(1)

        .effect()
        .name("Speak With Dead")
        .atLocation(target, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .file("jb2a.flames.01.blue")
        .belowTokens()
        .filter("ColorMatrix", { hue: -65 })
        .scaleToObject(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(250)
        .atLocation(target, { offset: { x: 0.5, y: -0.5 - 0.35 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.smoke.97")
        .scaleToObject(0.8)
        .opacity(0.4)
        .tint("#6ff087")
        .fadeIn(500)
        .zIndex(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomizeMirrorX()
        .persist()

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
        .name("Speak With Dead")
        .file("jb2a.token_border.circle.static.blue.012")
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(1.85, { considerTokenScale: true })
        .fadeIn(4000)
        .opacity(0.5)
        .filter("ColorMatrix", { hue: -65 })
        .zIndex(1.1)
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.2, duration: 2000, delay: 2000, gridUnits: true, ease: "easeInSine" })
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 4000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(100)
        .from(target)
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(0.95, { considerTokenScale: true })
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1.1)
        .persist()

        .effect()
        .name("Speak With Dead")
        .delay(2000)
        .file("jb2a.spirit_guardians.blue.spirits")
        .attachTo(target, { offset: { y: 0 }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(1.35, { considerTokenScale: true })
        .persist()
        .filter("ColorMatrix", { hue: -65 })
        .opacity(0.65)
        .fadeIn(1000)
        .zIndex(0.1)

        .effect()
        .name("Speak With Dead")
        .delay(3000)
        .file("jb2a.magic_signs.rune.necromancy.complete.blue")
        .attachTo(target, { offset: { y: -0.77 * target.document.width }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(0.4, { considerTokenScale: true })
        .persist()
        .filter("ColorMatrix", { hue: -65 })
        .opacity(1)
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 1000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .zIndex(2)

        .effect()
        .name("Speak With Dead")
        .delay(3000)
        .file("jb2a.magic_signs.rune.necromancy.complete.blue")
        .attachTo(target, { offset: { y: -0.55 * target.document.width }, gridUnits: true, bindAlpha: false, followRotation: false })
        .scaleToObject(0.4, { considerTokenScale: true })
        .persist()
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(2)

        .thenDo(function () {
            chrisPremades.helpers.removeCondition(target.actor, 'Dead');
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .effect()
        .name("Speak With Dead")
        .delay(100)
        .from(target)
        .attachTo(target, { bindAlpha: false, followRotation: false })
        .scaleToObject(1, { considerTokenScale: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.2, duration: 2000, delay: 2000, gridUnits: true, ease: "easeInSine" })
        .animateProperty("sprite", "rotation", { from: 0, to: 15, duration: 1000, delay: 2500, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: -15, duration: 1000, delay: 3000, ease: "easeInOutBack" })
        .loopProperty("spriteContainer", "position.y", { from: 0, to: 0.05, duration: 2500, delay: 4000, gridUnits: true, ease: "easeInOutQuad", pingPong: true })
        .persist()
        .zIndex(0.2)
        .waitUntilFinished()

        .play()
}