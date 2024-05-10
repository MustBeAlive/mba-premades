import {mba} from "../../../helperFunctions.js";

export async function comprehendLanguages({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Comprehend Languages` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.</p>
            <p>This spell doesn't decode secret messages in a text or a glyph, such as an arcane sigil, that isn't part of a written language.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.languages.all',
                'mode': 0,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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

    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];

    await new Sequence()

        .wait(50)

        .thenDo(function () {
            for (let i = 0; i < offset.length; i++) {

                new Sequence()

                    .effect()
                    .delay(250)
                    .file("jb2a.icon.runes02.blue")
                    .attachTo(token, { offset: offset[i], gridUnits: true, followRotation: false })
                    .scaleToObject(0.4)
                    .scaleIn(0, 250, { ease: "easeOutBack" })
                    .animateProperty("sprite", "position.x", { from: -0, to: -offset[i].x, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .animateProperty("sprite", "position.y", { from: -0, to: -offset[i].y, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .zIndex(1)
                    .duration(1150)

                    .effect()
                    .file("jb2a.template_circle.out_pulse.02.burst.bluewhite")
                    .attachTo(token, { offset: offset[i], gridUnits: true })
                    .scaleToObject(0.5)
                    .opacity(0.5)

                    .play()

            }
        })

        .wait(1250)

        .effect()
        .file("jb2a.energy_attack.01.blue")
        .attachTo(token, { followRotation: false })
        .scaleToObject(2.25)
        .belowTokens()
        .startTime(500)
        .endTime(2050)
        .fadeOut(400)
        .randomRotation()

        .effect()
        .file("jb2a.impact.010.blue")
        .attachTo(token)
        .scaleToObject(0.9)
        .zIndex(2)
        .waitUntilFinished(-1000)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .effect()
        .file("jb2a.template_circle.symbol.normal.runes.blue")
        .attachTo(token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .fadeOut(1000)
        .randomRotation()
        .mask(token)
        .persist()
        .name(`${token.document.name} Comprehend Languages`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(token, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.55, { considerTokenScale: true })
        .randomRotation()
        .fadeIn(500)
        .fadeOut(2500)
        .belowTokens()
        .opacity(0.45)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .tint("#30effd")
        .persist()
        .name(`${token.document.name} Comprehend Languages`)

        .effect()
        .from(token)
        .attachTo(token, { bindAlpha: false })
        .belowTokens()
        .mirrorX(token.document.data.mirrorX)
        .scaleToObject(1, { considerTokenScale: true })
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .filter("Glow", { color: 0x30effd, distance: 3, outerStrength: 4, innerStrength: 0 })
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(0.1)
        .persist()
        .name(`${token.document.name} Comprehend Languages`)

        .play()
}