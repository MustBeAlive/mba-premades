import {mba} from "../../../helperFunctions.js";

export async function naturesVeil({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You magically become invisible, along with any equipment you are wearing or carrying, until the start of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Invisible",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        },
    };
    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.green")
        .attachTo(workflow.token)
        .scaleToObject(2.3 * workflow.token.document.texture.scaleX)
        .duration(1300)
        .fadeOut(300)

        .effect()
        .delay(1000)
        .file("animated-spell-effects-cartoon.misc.weird.01")
        .atLocation(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 300 })

        .wait(1000)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}