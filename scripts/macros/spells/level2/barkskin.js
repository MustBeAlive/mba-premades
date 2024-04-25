export async function barkskin({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Barkskin` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, your skin has a rough, bark-like appearance and your AC score can't be less than 16, regardless of what kind of armor you are wearing.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.ac.value',
                'mode': 4,
                'value': 16,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.butterflies.complete.01.greenyellow")
        .attachTo(target)
        .scaleToObject(1.5)
        .duration(5500)
        .fadeIn(500)
        .fadeOut(1500)

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .delay(1500)
        .attachTo(target)
        .scaleToObject(1.8)
        .waitUntilFinished(-1600)

        .effect()
        .file("jb2a.plant_growth.03.round.4x4.complete.greenyellow")
        .attachTo(target)
        .duration(4000)
        .scaleToObject(2)
        .belowTokens()
        .fadeIn(500)
        .fadeOut(1500)

        .effect()
        .file("jb2a.shield_themed.below.molten_earth.01.orange")
        .delay(1800)
        .attachTo(target)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .opacity(0.8)
        .fadeIn(1000)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} Barkskin`)

        .wait(300)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .play()
}