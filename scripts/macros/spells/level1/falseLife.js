import {mba} from "../../../helperFunctions.js"

export async function falseLife({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        if (actor.system.attributes.hp.temp > 0) await actor.update({ "system.attributes.hp.temp": 0 })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You gain ${workflow.damageRoll.total} temp hit points for the duration.</p>
        `,
        'duration': {
            'seconds': 3600
        },
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
        .file("jb2a.particles.outward.orange.01.03")
        .attachTo(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(500)
        .filter("ColorMatrix", { hue: 80 })

        .effect()
        .file("jb2a.cast_shape.circle.single01.green")
        .attachTo(workflow.token)
        .scaleToObject(1.7 * workflow.token.document.texture.scaleX)
        .delay(500)
        .playbackRate(0.85)

        .effect()
        .file("jb2a.cure_wounds.400px.pink")
        .attachTo(workflow.token)
        .scaleToObject(1.7 * workflow.token.document.texture.scaleX)
        .delay(1000)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleIn(0.5, 1000)
        .filter("ColorMatrix", { hue: 200 })
        .playbackRate(0.85)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}
