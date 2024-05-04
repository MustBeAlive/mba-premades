import {mba} from "../../../helperFunctions.js";

export async function recklessAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Reckless Attack` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.mwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
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
        .atLocation(token)
        .size(4, { gridUnits: true })
        .opacity(0.25)

        .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(token)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(token)
        .belowTokens()
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(0)

        .effect()
        .file("jb2a.token_border.circle.static.orange.012")
        .atLocation(token)
        .attachTo(token)
        .opacity(0.6)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .mask()
        .persist()
        .name(`${token.document.name} Reckless Attack`)

        .play()

    await mba.createEffect(workflow.actor, effectData);
}