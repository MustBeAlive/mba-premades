import {mba} from "../../../helperFunctions.js";

async function woundedFury(token) {
    if (mba.findEffect(token.actor, "Wounded Fury")) return;
    if (mba.findEffect(token.actor, "Dead")) return;
    let currentHP = token.actor.system.attributes.hp.value;
    if (currentHP > 10) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Wounded Fury` })
    }
    let effectData = {
        'name': "Wounded Fury",
        'icon': "modules/mba-premades/icons/generic/wounded_fury.webp",
        'description': `
            <p>While quaggoth has 10 hit points or fewer, the quaggoth has advantage on attack rolls. In addition, it deals an extra 2d6 damage to any target it hits with a melee attack.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': "+2d6[slashing]",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuation': ['zeroHP']
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
        .size(3.5, { gridUnits: true })
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(token)
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
        .name(`${token.document.name} Wounded Fury`)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData);
        })

        .play()
}

export let quaggoth = {
    'woundedFury': woundedFury
}