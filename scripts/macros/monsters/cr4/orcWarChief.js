import {mba} from "../../../helperFunctions.js";

async function battleCry({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = mba.findNearby(workflow.token, 30, "ally", false, false).filter(t => !mba.findEffect(t.actor, "Deafened") && !mba.findEffect(t.actor, "Orc Warchief: Battle Cry"));
    if (!targets.length) return;
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} OrcWBC` })
            })

            .play();
    };
    let effectData = {
        'name': "Orc Warchief: Battle Cry",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on all attack rolls until the start of Orc Warchief's next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file('jb2a.extras.tmfx.outpulse.circle.02.normal')
        .atLocation(workflow.token)
        .size(4, { 'gridUnits': true })
        .opacity(0.25)

        .effect()
        .file('jb2a.impact.ground_crack.orange.02')
        .atLocation(workflow.token)
        .belowTokens()
        .filter('ColorMatrix', { 'hue': 20, 'saturate': 1 })
        .size(3.5, { 'gridUnits': true })
        .zIndex(1)

        .effect()
        .file('jb2a.impact.ground_crack.still_frame.02')
        .atLocation(workflow.token)
        .belowTokens()
        .fadeIn(2000)
        .filter('ColorMatrix', { 'hue': -15, 'saturate': 1 })
        .size(3.5, { 'gridUnits': true })
        .duration(8000)
        .fadeOut(3000)
        .zIndex(0)

        .wait(200)

        .play()

    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
            .attachTo(target)
            .size(4, { gridUnits: true })
            .opacity(0.25)

            .effect()
            .file("jb2a.impact.ground_crack.orange.02")
            .atLocation(target)
            .belowTokens()
            .filter("ColorMatrix", { hue: -15, saturate: 1 })
            .size(3.5, { gridUnits: true })
            .zIndex(1)

            .effect()
            .file("jb2a.impact.ground_crack.still_frame.02")
            .atLocation(target)
            .belowTokens()
            .fadeIn(1000)
            .filter("ColorMatrix", { hue: -15, saturate: 1 })
            .size(3.5, { gridUnits: true })
            .zIndex(0)

            .effect()
            .file("jb2a.token_border.circle.static.orange.012")
            .atLocation(target)
            .attachTo(target)
            .opacity(0.6)
            .scaleToObject(2)
            .filter("ColorMatrix", { saturate: 1 })
            .tint("#FF0000")
            .fadeOut(500)
            .mask()
            .persist()
            .name(`${target.document.name} OrcWBC`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let orcWarChief = {
    'battleCry': battleCry
}