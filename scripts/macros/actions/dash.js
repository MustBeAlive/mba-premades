export async function dash({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Dash` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.</p>
            <p>Any increase or decrease to your speed changes this additional movement by the same amount. If your speed of 30 feet is reduced to 15 feet, for instance, you can move up to 30 feet this turn if you dash.</p>
        `,
        'duration': {
            'turns': 1
        },
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.cast_shape.circle.single01.blue")
        .atLocation(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.wind_lines.01.leaves.02.green")
        .attachTo(token)
        .mask()
        .playbackRate(1.7)
        .delay(750)
        .persist()
        .name(`${token.document.name} Dash`)

        .wait(750)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(workflow.actor, effectData);
        })

        .play();
}