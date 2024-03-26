// Animation by Sammo#3425 and EskieMoh#2969
async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let hasCharmImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
    if (!hasCharmImmunity) return;
    let immuneData = {  
        'name': 'Save Immunity',
        'icon': 'assets/library/icons/sorted/generic/generic_buff.webp',
        'description': "You succeed on the next save you make",
        'duration': {
            'turns': 1  
        },
        'changes': [
            {
                'key': 'flags.midi-qol.min.ability.save.all',
                'value': '100',
                'mode': 2,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': [
                    'isSave'
                ]
            },
            'chris-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, immuneData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacro() {
        if (Tagger.hasTags(token, "Dancing")) {
            await Tagger.removeTags(token, "Dancing")
            await Sequencer.EffectManager.endEffects({ name: "Dance", object: token })
        }
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "<p>You are affected by Otto's Irresistable Dance and begin a comic dance in place: shuffling, tapping your feet and capering for the spell duration.</p><p>On your turn, you must use all of your movement to dance without leaving your space and have disadvantage on Dexterity saving throws and attack rolls.</p><p>While you are affected by this spell, other creatures have advantage on attack rolls against you.</p><p>As an action, you can make a Wisdom saving throw in attempt to regain control of yourself. On a successful save, the spell ends.</p>",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Irresistable Dance',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let facing;
    let mirrorFace;
    if (Tagger.hasTags(target, "RFace") && target.document.mirrorX == false || !Tagger.hasTags(target, "RFace") && target.document.mirrorX == true) {
        facing = -1;
        mirrorFace = false;
    } else {
        facing = 1;
        mirrorFace = true;
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

        .play();

    await Tagger.addTags(target, "Dancing");
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    new Sequence()

        .effect()
        .name("Dance")
        .file("jb2a.butterflies.few.yellow")
        .attachTo(target, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .persist()
        .zIndex(0)

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .name("Dance")
        .file("https://i.imgur.com/SQWSf10.png")
        .attachTo(target, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 5, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()

        .effect()
        .name("Dance")
        .file("https://i.imgur.com/iWuBQ10.png")
        .attachTo(target, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()

        .effect()
        .name("Dance")
        .from(target)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(target, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.11, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 900, ease: "easeOutCubic", pingPong: true })
        .rotate(-15 * facing)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 900, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .waitUntilFinished(-200)

        .thenDo(function () {
            Tagger.removeTags(target, "Dancing")
            Sequencer.EffectManager.endEffects({ name: "Dance", object: target });
        })

        .animation()
        .on(target)
        .opacity(1)

        .play()
}

export let ottoIrresistibleDance = {
    'cast': cast,
    'item': item
}