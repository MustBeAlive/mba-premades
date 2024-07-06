import {mba} from "../../../helperFunctions.js";

// To do: 30 day save? (hell no)

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} FBM1`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} FBM1`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} FBM2`)

        .effect()
        .file("jb2a.impact.010.purple")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .zIndex(1)

        .wait(50)

        .effect()
        .file("jb2a.twinkling_stars.points04.orange")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.25, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 4042, ease: "easeOutSine" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .rotate(0)
        .zIndex(1)
        .filter("ColorMatrix", { hue: 260 })
        .persist()
        .name(`${workflow.token.document.name} FBM1`)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.03.normal")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.35)
        .duration(4042)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.275, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .spriteOffset({ x: -0.175 }, { gridUnits: true })
        .rotate(0)
        .opacity(0.8)
        .zIndex(0)
        .tint("#89eb34")
        .persist()
        .name(`${workflow.token.document.name} FBM1`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your Intelligence and Charisma scores become 1. You can't cast spells, activate magic items, understand language, or communicate in any intelligible way.</p>
            <p>You can, however, identify your friends, follow them, and even protect them.</p>
            <p>At the end of every 30 days, you can repeat your saving throw against this spell. If you succeed, the spell ends.</p>
        `,
        'changes': [
            {
                'key': 'system.abilities.int.value',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.abilities.cha.value',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.vocal',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.somatic',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.material',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'spell': {
                    'feeblemind': {
                        'spellDC': mba.getSpellDC(workflow.item),
                    }
                },
                'isCurse': true,
                'greaterRestoration': true,
                'heal': true,
                'wish': true
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 8,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} FBM1` })
        })

        .effect()
        .file("jb2a.disintegrate.purpleblue")
        .atLocation(workflow.token)
        .stretchTo(target)
        .zIndex(1)
        .playbackRate(1.3)
        .repeats(3, 800)

        .effect()
        .file("jb2a.impact.004.pinkpurple")
        .atLocation(target)
        .scaleToObject(2.5)
        .fadeOut(1167)
        .scaleIn(0, 1167, { ease: "easeOutCubic" })
        .opacity(0.45)

        .canvasPan()
        .shake({ duration: 100, strength: 25, rotation: false })

        .effect()
        .file("jb2a.static_electricity.03.purple")
        .attachTo(target)
        .scaleToObject(1.25)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(1)
        .playbackRate(4)
        .randomRotation()
        .repeats(10, 250, 250)

        .effect()
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(10000)
        .fadeIn(5000)
        .fadeOut(5000)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.5 })

        .effect()
        .file("jb2a.token_border.circle.static.purple.009")
        .attachTo(target)
        .scaleToObject(1.8, { considerTokenScale: true })
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(6000)
        .belowTokens()

        .effect()
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .fadeIn(100)
        .fadeOut(1000)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
        .playbackRate(4)
        .opacity(0.15)
        .zIndex(0.1)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} FBM2` })
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let feeblemind = {
    'cast': cast,
    'item': item
}