import {mba} from "../../../helperFunctions.js";

export async function divineFavor({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroEnd() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DivFav` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, your weapon attacks deal an extra 1d4 radiant damage on a hit.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': "+1d4[radiant]",
                'priority': 20
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': "+1d4[radiant]",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroEnd)
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

    new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.white.02.03`)
        .attachTo(workflow.token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.yellowwhite")
        .atLocation(workflow.token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .atLocation(workflow.token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.orange.002")
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 20 })
        .playbackRate(0.85)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} DivFav`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}