async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.token;
    let poisonImmune = await chrisPremades.helpers.checkTrait(target.actor, 'ci', 'poisoned');
    if (poisonImmune) {
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: "<b>" + target.document.name + "</b> is immune to Dancing Monkey Fruit effects! (has immunity to poisoned condtion)",
            speaker: { actor: null, alias: "GM Helper" }
        });
        return;
    }
    let saveRoll = await chrisPremades.helpers.rollRequest(target, 'save', 'con');
    if (!saveRoll) return;
    if (saveRoll.total >= 14) return;
    async function effectMacroStart() {
        await new Dialog({
            title: "Dancing Monkey Fruit",
            content: `
                <p>You must use all of your movement to dance without leaving your space.</p>
            `,
            buttons: {
                ok: {
                    label: "Ok!",
                }
            }
        }).render(true);
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Dancing Monkey Fruit` })
        await new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        let effectData = {
            'name': "Dancing Monkey Fruit: Poisoning",
            'icon': "icons/consumables/fruit/guanabana-soursop-cut-orange.webp",
            'description': `You suffered effects of Dancing Monkey Fruit and are poisoned for the next hour.`,
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
        await chrisPremades.helpers.createEffect(actor, effectData);
    }
    let effectData = {
        'name': "Dancing Monkey Fruit",
        'icon': "icons/consumables/fruit/guanabana-soursop-cut-orange.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Dancing Monkey's Fruit and begin a comic dance, that lasts for 1 minute.</p>
            <p>On your turn, you must use all of your movement to dance without leaving your space.</p>
            <p>You have disadvantage on attack rolls and dexterity saving throws, and other creatures have advantage on attack rolls against you.</p>
            <p>Each time you take damage, you can repeat the saving throw, ending the effect on a success. When the dancing effect ends, you suffer from poisoned condition for the next hour.</p>
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
                    'script': chrisPremades.helpers.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(30, 300, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
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
        .atLocation(token, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1.5 })
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
        .atLocation(token, { randomOffset: 1.2, gridUnits: true })
        .scaleToObject(0.5)
        .repeats(8, 100, 100)
        .filter("ColorMatrix", { saturate: 1, hue: -170 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.mending.yellow")
        .atLocation(token)
        .scaleToObject(3)
        .opacity(0.75)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
        .zIndex(0)
        .waitUntilFinished(-500)

        .effect()
        .delay(300)
        .file("jb2a.impact.002.orange")
        .atLocation(token)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { hue: 6 })
        .zIndex(0)

        .effect()
        .file("jb2a.particles.inward.white.02.03")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(300)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.magic.impact.01")
        .atLocation(token)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -210 })
        .zIndex(0)
        .belowTokens()

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .play();

    new Sequence()

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(token, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .persist()
        .zIndex(0)
        .name(`${token.document.name} Dancing Monkey Fruit`)

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .file("https://i.imgur.com/SQWSf10.png")
        .attachTo(token, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 5, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${token.document.name} Dancing Monkey Fruit`)

        .effect()
        .file("https://i.imgur.com/iWuBQ10.png")
        .attachTo(token, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${token.document.name} Dancing Monkey Fruit`)

        .effect()
        .from(token)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(token, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.11, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 900, ease: "easeOutCubic", pingPong: true })
        .rotate(-15)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .name(`${token.document.name} Dancing Monkey Fruit`)

        .play()
}

async function damaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await chrisPremades.helpers.findEffect(actor, "Dancing Monkey Fruit");
    if (!effect) return;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
    if (saveRoll.total < 14) return;
    await chrisPremades.helpers.removeEffect(effect);
}

export let dancingMonkeyFruit = {
    'item': item,
    'damaged': damaged
}