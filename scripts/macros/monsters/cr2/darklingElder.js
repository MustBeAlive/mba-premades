import {mba} from "../../../helperFunctions.js";

async function deathBurnCast(token, origin) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.01.yellow")
        .attachTo(token)
        .size(8, { gridUnits: true })
        .playbackRate(0.9)

        .effect()
        .file("jb2a.explosion.02.yellow")
        .attachTo(token)
        .size(8, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function deathBurnItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let effectData = {
        'name': "Darkling Elder: Blindness",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are blinded by a flash of magical light until the end of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd', 'combatEnd']
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.checkTrait(target.actor, "ci", "blinded")) await mba.createEffect(target.actor, effectData);
    }
}

export let darklingElder = {
    'deathBurnCast': deathBurnCast,
    'deathBurnItem': deathBurnItem
}