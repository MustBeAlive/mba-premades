import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.checkTrait(target.actor, 'ci', 'charmed')) return;
    await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} IrrD`})
        await new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Otto's Irresistable Dance and begin a comic dance in place: shuffling, tapping your feet and capering for the spell duration.</p>
            <p>On your turn, you must use all of your movement to dance without leaving your space and have disadvantage on Dexterity saving throws and attack rolls.</p>
            <p>While you are affected by this spell, other creatures have advantage on attack rolls against you.</p>
            <p>As an action, you can make a Wisdom saving throw in attempt to regain control of yourself. On a successful save, the spell ends.</p>
        `,
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
                'value': 'actionSave=true, saveAbility=wis, saveDC=' + mbaPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Irresistable Dance',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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

    await new Sequence()

        .effect()
        .file("jb2a.music_notations.{{music}}.orange")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .atLocation(workflow.token, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1.5 })
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
        .zIndex(0)
        .persist()
        .name(`${target.document.name} IrrD`)

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter1.webp")
        .attachTo(target, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 5, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} IrrD`)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter2.webp")
        .attachTo(target, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 250, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${target.document.name} IrrD`)

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
        .name(`${target.document.name} IrrD`)

        .play()
}

export let ottoIrresistibleDance = {
    'cast': cast,
    'item': item
}