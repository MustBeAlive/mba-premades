// Animation by EskieMoh#2969
async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let targetInt = target.actor.system.abilities.int.value;
    if (targetInt <= 4) {
        ui.notifications.warn(target.document.name + " is unaffected by Tasha's Hideous Laughter!")
        await chrisPremades.helpers.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Hideous Laughter`, object: token })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "You perceive everything as hilariously funny and fall into fits of laughter. At the end of each of yours turns, and each time you take damage while affected by this spell, you can can make another Wisdom saving throw. You have advantage on the saving throw if it's triggered by damage. On a success, the spell ends.",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Incapacitated",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ', saveMagic=true, name=Tasha\'s Hideous Laughted: Turn End',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.tashaHideousLaughter.damaged,isDamaged',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'tashaHideousLaughter': {
                        'spellDC': chrisPremades.helpers.getSpellDC(workflow.item)
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.yellow`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.yellow`)
        .scaleToObject(1.5)
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

    new Sequence()

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(target, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .zIndex(0)
        .persist()
        .name(`${target.document.name} Hideous Laughter`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
            chrisPremades.helpers.addCondition(target.actor, 'Prone');
        })

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .file("https://i.imgur.com/SQWSf10.png")
        .attachTo(target, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} Hideous Laughter`)

        .effect()
        .file("https://i.imgur.com/iWuBQ10.png")
        .attachTo(target, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} Hideous Laughter`)

        .effect()
        .from(target)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(target, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 600, ease: "easeOutCubic", pingPong: true })
        .rotate(-90)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .name(`${target.document.name} Hideous Laughter`)
        .waitUntilFinished(-200)

        .animation()
        .on(target)
        .opacity(1)

        .play();
}

async function damaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let saveAdvantage = {
        'name': 'Save Advantage',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'description': "You have advantage on the next save you make",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.ability.save.all',
                'mode': 0,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["isSave"]
            },
            'chris-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(actor, saveAdvantage);
    let effect = await chrisPremades.helpers.findEffect(actor, "Tasha's Hideous Laughter");
    let saveDC = effect.flags['mba-premades']?.spell?.tashaHideousLaughter?.spellDC;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'wis');
    if (saveRoll.total < saveDC) return;
    await chrisPremades.helpers.removeEffect(effect);
}

export let tashaHideousLaughter = {
    'cast': cast,
    'damaged': damaged
}