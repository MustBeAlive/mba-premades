import {mba} from "../../../helperFunctions.js";

export async function greaterInvisibility({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are invisible until the spell ends.</p>
            <p>This effect ends early only if caster of the spell loses concentration.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Invisible",
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.particle_burst.01.circle.orangepink")
        .attachTo(target)
        .scaleToObject(2.3 * target.document.texture.scaleX)
        .duration(1300)
        .fadeOut(300)

        .effect()
        .delay(1000)
        .file("animated-spell-effects-cartoon.misc.weird.01")
        .atLocation(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 100 })

        .wait(1500)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()
}