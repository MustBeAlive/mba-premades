import {mba} from "../../../helperFunctions.js";

export async function aggressive({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Aggressive` })
    }
    let effectData = {
        'name': "Aggressive",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p><u>${workflow.token.document.name}</u> moves up to its speed toward a hostile creature that it can see.</p>
        `,
        'duration': {
            'turns': 1
        },
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
        .atLocation(workflow.token)
        .size(4, { gridUnits: true })
        .opacity(0.25)

        .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(workflow.token)
        .size(3.5, { gridUnits: true })
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(workflow.token)
        .size(3.5, { gridUnits: true })
        .fadeIn(1000)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .zIndex(0)

        .effect()
        .file("jb2a.wind_lines.01.leaves.02.green")
        .attachTo(token)
        .delay(750)
        .playbackRate(1.7)
        .mask()
        .persist()
        .name(`${token.document.name} Aggressive`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}