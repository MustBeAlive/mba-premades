import {mba} from "../../../helperFunctions.js";

export async function jump({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your jump distance is tripled until the spell ends.</p>
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

    new Sequence()

        .effect()
        .file("jb2a.particles.inward.greenyellow.02.05")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.transmutation.complete.yellow")
        .attachTo(target)
        .scaleToObject(1 * target.document.texture.scaleX)
        .delay(500)

        .wait(1500)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}