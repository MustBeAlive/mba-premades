import {mba} from "../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.token;
    if (mba.checkTrait(target.actor, 'ci', 'poisoned')) {
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `<u>${target.document.name}</u> is unaffected by Dancing Monkey Fruit!`,
            speaker: { actor: null, alias: "GM Helper" }
        });
        return;
    }
    let saveRoll = await mba.rollRequest(target, 'save', 'con');
    if (!saveRoll) return;
    if (saveRoll.total >= 14) return;
    async function effectMacroStart() {
        await mbaPremades.helpers.dialog("Dancing Monkey Fruit", [["Ok!", "ok"]], `<b>You must use all of your movement to dance without leaving your space.</b><p></p>`);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DaMoFr` })
        await new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        let effectData = {
            'name': "Dancing Monkey Fruit: Poison",
            'icon': "icons/consumables/fruit/guanabana-soursop-cut-orange.webp",
            'description': `You suffered effects of Dancing Monkey Fruit and are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} for the next hour.`,
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Poisoned",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': false
                }
            }
        }
        await mba.createEffect(actor, effectData);
    }
    let effectData = {
        'name': "Dancing Monkey Fruit",
        'icon': "icons/consumables/fruit/guanabana-soursop-cut-orange.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Dancing Monkey's Fruit and begin a comic dance, that lasts for 1 minute.</p>
            <p>On your turn, you must use all of your movement to dance without leaving your space.</p>
            <p>You have disadvantage on attack rolls and dexterity saving throws, and other creatures have advantage on attack rolls against you.</p>
            <p>Each time you take damage, you can repeat the saving throw, ending the effect on a success. When the dancing effect ends, you suffer from @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} condition for the next hour.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.dancingMonkeyFruit.damaged,isDamaged',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .atLocation(target)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(30, 300, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(target)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .file("jb2a.music_notations.{{music}}.orange")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .atLocation(target, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1.5 })
        .scaleToObject(0.5)
        .zIndex(1)
        .playbackRate(1.5)
        .setMustache({
            "music": () => {
                const musics = [`bass_clef`, `beamed_quavers`, `crotchet`, `flat`, `quaver`, `treble_clef`];
                return musics[Math.floor(Math.random() * musics.length)];
            }
        })
        .repeats(5, 200, 200)
        .fadeOut(500)
        .waitUntilFinished(-1500)

        .effect()
        .file("animated-spell-effects-cartoon.level 01.bless.blue")
        .atLocation(target, { randomOffset: 1.2, gridUnits: true })
        .scaleToObject(0.5)
        .repeats(8, 100, 100)
        .filter("ColorMatrix", { saturate: 1, hue: -170 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.mending.yellow")
        .atLocation(target)
        .scaleToObject(3)
        .opacity(0.75)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
        .zIndex(0)
        .waitUntilFinished(-500)

        .effect()
        .delay(300)
        .file("jb2a.impact.002.orange")
        .atLocation(target)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { hue: 6 })
        .zIndex(0)

        .effect()
        .file("jb2a.particles.inward.white.02.03")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(300)
        .fadeOut(1000)
        .atLocation(target)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.magic.impact.01")
        .atLocation(target)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -210 })
        .zIndex(0)
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play();

    new Sequence()

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(target, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .persist()
        .zIndex(0)
        .name(`${target.document.name} DaMoFr`)

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter1.webp")
        .attachTo(target, { offset: { x: 0.4 * target.document.width, y: -0.45 * target.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 5, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} DaMoFr`)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter2.webp")
        .attachTo(target, { offset: { x: 0.55 * target.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} DaMoFr`)

        .effect()
        .from(target)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(target, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.11, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 900, ease: "easeOutCubic", pingPong: true })
        .rotate(-15)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .name(`${target.document.name} DaMoFr`)

        .play()
}

async function damaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(actor, "Dancing Monkey Fruit");
    if (!effect) return;
    let saveRoll = await mba.rollRequest(token, 'save', 'con');
    if (saveRoll.total < 14) return;
    await mba.removeEffect(effect);
}

export let dancingMonkeyFruit = {
    'item': item,
    'damaged': damaged
}