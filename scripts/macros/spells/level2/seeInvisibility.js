import {mba} from "../../../helperFunctions.js";

export async function seeInvisibility({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane.</p>
            <p>Ethereal creatures and objects appear ghostly and translucent.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'ATL.detectionModes.seeInvisibility.range',
                'mode': 0,
                'value': 300,
                'priority': 20
            },
        ],
        'flags': {
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
        .file("jb2a.swirling_sparkles.01.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.7)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.eyes.01.orangeyellow.single.2")
        .attachTo(workflow.token)
        .scaleToObject(1.15)
        .filter("ColorMatrix", { hue: 150 })
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .effect()
        .file("jb2a.energy_field.02.below.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .delay(1000)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()

        .play()
}