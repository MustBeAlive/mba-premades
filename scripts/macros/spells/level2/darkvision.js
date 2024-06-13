import {mba} from "../../../helperFunctions.js";

export async function darkvision({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you have Darkvision out to a range of 60 feet.</p>
        `,
        'duration': {
            'seconds': 28800
        },
        'changes': [
            {
                'key': 'system.attributes.senses.darkvision',
                'mode': 4,
                'value': 60,
                'priority': 20
            },
            {
                'key': 'ATL.sight.range',
                'mode': 4,
                'value': 60,
                'priority': 5
            },
            {
                'key': 'ATL.sight.visionMode',
                'mode': 0,
                'value': "darkvision",
                'priority': 5
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
        .file("jb2a.swirling_sparkles.01.yellow")
        .attachTo(target)
        .scaleToObject(1.7)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.eyes.01.orangeyellow.single.2")
        .attachTo(target)
        .scaleToObject(1.15)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.fireflies.few.01.orange")
        .attachTo(target)
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.fireflies.few.02.orange")
        .attachTo(target)
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(1000)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .effect()
        .file("jb2a.energy_field.02.below.yellow")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .delay(1000)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()

        .play()
}