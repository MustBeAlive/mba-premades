import {mba} from "../../../helperFunctions.js";

export async function bladeWard({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.01.outro_explode.yellow")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Blade Ward` })
            })

            .play()
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Enemies substract 1d4 from all attack rolls made against you.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.grants.attack.bonus.all',
                'mode': 2,
                'value': "-1d4",
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
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield.01.intro.yellow")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.01.loop.yellow")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .delay(600)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name(`${token.document.name} Blade Ward`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .play()
}