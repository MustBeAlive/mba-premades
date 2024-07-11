import {mba} from "../../../helperFunctions.js";

export async function trueSeeing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effectData = {
        'name': "True Seeing",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you have truesight, notice secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.senses.truesight',
                'mode': 4,
                'value': 120,
                'priority': 20
            },
            {
                'key': 'ATL.detectionModes.seeAll.range',
                'mode': 4,
                'value': 120,
                'priority': 20
            },
            {
                'key': 'ATL.sight.range',
                'mode': 4,
                'value': 120,
                'priority': 5
            },
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.swirling_sparkles.01.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.7)
        .waitUntilFinished(-1000)

        .effect()
        .file(workflow.item.img)
        .attachTo(workflow.token)
        .scaleToObject(1)
        .duration(6000)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(1)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .duration(5500)
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(2)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .duration(5500)
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(2)

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