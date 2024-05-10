import {mba} from "../../helperFunctions.js";

export async function disengage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.",
        'duration': {
            'turns': 1
        },
        'flags': {
            'dae': {
                'showIcon': true
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.cast_shape.circle.single01.yellow")
        .atLocation(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 325 })

        .effect()
        .file("jb2a.shimmer.01.orange")
        .atLocation(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 310 })
        .delay(750)
        .repeats(3, 600)

        .wait(600)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .play()
}