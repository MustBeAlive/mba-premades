import {mba} from "../../../helperFunctions.js";

async function reckless({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Reckless` })
            })

            .play();
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on all melee weapon attack rolls, but attack rolls against you have advantage until the start of your next turn.</p>
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
        .attachTo(workflow.token)
        .size(4, { gridUnits: true })
        .opacity(0.25)

        .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(workflow.token)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(workflow.token)
        .belowTokens()
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(0)

        .effect()
        .file("jb2a.wind_stream.white")
        .atLocation(workflow.token, { offset: { x: 0, y: 75 } })
        .size(1.75, { gridUnits: true })
        .rotate(90)
        .opacity(0.9)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 50, pingPong: true })
        .duration(8000)
        .fadeOut(3000)

        .effect()
        .file("jb2a.particles.outward.orange.01.03")
        .atLocation(workflow.token)
        .scaleToObject(2.5)
        .opacity(1)
        .fadeIn(200)
        .fadeOut(3000)
        .loopProperty("sprite", "position.x", { from: -5, to: 5, duration: 50, pingPong: true })
        .animateProperty("sprite", "position.y", { from: 0, to: -100, duration: 6000, pingPong: true, delay: 2000 })
        .duration(8000)

        .effect()
        .file("jb2a.wind_stream.white")
        .attachTo(workflow.token)
        .scaleToObject()
        .rotate(90)
        .opacity(1)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} Reckless`)

        .effect()
        .file("jb2a.token_border.circle.static.orange.012")
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .opacity(0.6)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .mask()
        .persist()
        .name(`${workflow.token.document.name} Reckless`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

export let berserker = {
    'reckless': reckless
}