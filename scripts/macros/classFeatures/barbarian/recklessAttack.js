import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.actor, "Reckless Attack")) return;
    let originFeature = mba.getItem(workflow.actor, "Reckless Attack");
    if (!originFeature) return;
    if (!mba.perTurnCheck(originFeature, "feature", "recklessAttack")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'recklessAttack', 30);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog(originFeature.name, constants.yesNo, `Use <b>${originFeature.name}</b>?`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        await mba.setTurnCheck(originFeature, "feature", "recklessAttack");
        queue.remove(workflow.item.uuid);
        return;
    }
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Reckless Attack` })
    };
    const effectData = {
        'name': "Reckless Attack",
        'icon': "modules/mba-premades/icons/class/barbarian/reckless_attack.webp",
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
        .atLocation(workflow.token)
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
        .name(`${workflow.token.document.name} Reckless Attack`)

        .play()

    await mba.createEffect(workflow.actor, effectData);
    queue.remove(workflow.item.uuid);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feature.recklessAttack.turn', '');
}

export let recklessAttack = {
    'attack': attack,
    'combatEnd': combatEnd
}