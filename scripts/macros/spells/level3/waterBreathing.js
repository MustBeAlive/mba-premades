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
    for (let target of targets) {
        let delay = 2000 + Math.floor(Math.random() * (Math.floor(1500) - Math.ceil(50)) + Math.ceil(50));
        new Sequence()

            .effect()
            .file("jb2a.liquid.blob.blue")
            .attachTo(target)
            .scaleToObject(1.2 * target.document.texture.scaleX)
            .fadeIn(500)
            .duration(delay)

            .effect()
            .file("jb2a.energy_attack.01.blue")
            .delay(delay)
            .attachTo(target, { followRotation: false })
            .scaleToObject(2.25)
            .belowTokens()
            .startTime(500)
            .endTime(2050)
            .fadeOut(400)
            .randomRotation()

            .effect()
            .file("jb2a.impact.010.blue")
            .delay(delay)
            .attachTo(target)
            .scaleToObject(0.9)
            .zIndex(2)
            .waitUntilFinished(-1000)

            .effect()
            .file("jb2a.markers.bubble.02.loop.blue.0")
            .scale(0.4)
            .fadeIn(300)
            .fadeOut(1000)
            .opacity(0.6)
            .attachTo(target)
            .mask(target)
            .playbackRate(0.9)
            .persist()
            .name(`${target.document.name} Water Breathing`)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData);
            })

            .play()
    }
}