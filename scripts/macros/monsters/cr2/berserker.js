import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function reckless(token) {
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Reckless", constants.yesNo, "<b>Use Reckless?</b>");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let feature = await mba.getItem(token.actor, "Reckless");
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
        'name': "Reckless",
        'icon': "modules/mba-premades/icons/class/barbarian/reckless_attack.webp",
        'origin': feature.uuid,
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
                'specialDuration': ['turnStart', 'zeroHP', 'combatEnd']
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
        .attachTo(token)
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
        .file("jb2a.wind_stream.white")
        .attachTo(token)
        .scaleToObject()
        .rotate(90)
        .opacity(1)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Reckless`)

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
        .name(`${token.document.name} Reckless`)

        .thenDo(async () => {
            await feature.displayCard();
            await mba.createEffect(token.actor, effectData);
        })

        .play()
}

export let berserker = {
    'reckless': reckless
}