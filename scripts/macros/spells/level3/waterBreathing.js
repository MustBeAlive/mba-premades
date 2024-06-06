import {mba} from "../../../helperFunctions.js";

export async function waterBreathing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Water Breathing` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have the ability to breathe underwater until the spell ends.</p>
            <p>You also retain their normal mode of respiration.</p>
        `,
        'duration': {
            'seconds': 86400
        },
        'flags': {
            'effectmacro': {
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
    for (let target of targets) {
        let delay = 2000 + Math.floor(Math.random() * (Math.floor(1500) - Math.ceil(50)) + Math.ceil(50));
        new Sequence()

            .effect()
            .file("jb2a.liquid.blob.blue")
            .attachTo(target)
            .scaleToObject(1.2 * target.document.texture.scaleX)
            .duration(delay)
            .fadeIn(500)

            .effect()
            .file("jb2a.energy_attack.01.blue")
            .attachTo(target, { followRotation: false })
            .scaleToObject(2.25)
            .delay(delay)
            .fadeOut(400)
            .startTime(500)
            .endTime(2050)
            .belowTokens()
            .randomRotation()

            .effect()
            .file("jb2a.impact.010.blue")
            .attachTo(target)
            .scaleToObject(0.9)
            .delay(delay)
            .zIndex(2)
            .waitUntilFinished(-1000)

            .effect()
            .file("jb2a.markers.bubble.02.loop.blue.0")
            .attachTo(target)
            .scale(0.4)
            .fadeIn(300)
            .fadeOut(1000)
            .opacity(0.6)
            .playbackRate(0.9)
            .mask(target)
            .persist()
            .name(`${target.document.name} Water Breathing`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}