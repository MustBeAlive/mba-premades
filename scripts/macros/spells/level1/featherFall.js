export async function featherFall({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, your rate of descent slows to 60 feet per round.</p>
            <p>If you land before the spell ends, you take no falling damage and can land on your feet.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        let delay1 = 500 + Math.floor(Math.random() * (Math.floor(1500) - Math.ceil(50)) + Math.ceil(50));

        new Sequence()

            .effect()
            .file("jb2a.energy_strands.range.multiple.orange.01")
            .atLocation(token)
            .stretchTo(target)
            .delay(delay1)
            .waitUntilFinished(-750)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.swirling_feathers.outburst.01.orange.1")
            .atLocation(target)
            .scaleToObject(2 * target.document.texture.scaleX)

            .play()
    }
}