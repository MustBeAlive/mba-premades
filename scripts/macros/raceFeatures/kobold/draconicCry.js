import { mba } from "../../../helperFunctions.js";

export async function draconicCry({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(mba.findNearby(workflow.token, 10, "enemy", false, false)).filter(t => !mba.findEffect(t.actor, "Deafened"));
    if (!targets.length) {
        ui.notifications.warn("There are no valid targets within 10 feet of you!");
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>All attack rolls against you are made at advantage until the start of <b>${workflow.token.document.name}</b> next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.impact.ground_crack.orange.03")
        .atLocation(workflow.token)
        .scale(0.6)
        .belowTokens()

        .effect()
        .file("jb2a.soundwave.02.orangeyellow")
        .attachTo(workflow.token)
        .scaleToObject(5)
        .delay(200)
        .playbackRate(2.5)
        .repeats(3, 300)

        .wait(500)

        .thenDo(async () => {
            for (let target of targets) await mba.createEffect(target.actor, effectData);
        })

        .play()
}