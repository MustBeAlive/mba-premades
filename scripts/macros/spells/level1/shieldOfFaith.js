import {mba} from "../../../helperFunctions.js";

export async function shieldOfFaith({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.02.outro_explode.yellow")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .zIndex(5)
            .waitUntilFinished(-500)

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shield of Faith`, object: token })
            })

            .play()
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Shield of Faith grants you +2 bonus to AC for the duration.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': '+2',
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
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield.02.intro.yellow")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.02.loop.yellow")
        .delay(600)
        .fadeIn(500)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)
        .zIndex(5)
        .persist()
        .name(`${target.document.name} Shield of Faith`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}