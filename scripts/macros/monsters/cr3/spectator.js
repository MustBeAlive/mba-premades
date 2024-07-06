import {mba} from "../../../helperFunctions.js";

// To do: all

async function rayRoll({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Eye Ray: Passive");
}

async function rayConfusion({ speaker, actor, token, character, item, args, scope, workflow }) {

}

async function rayParalyzing({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    const effectData = {
        'name': "Spectator: Paralyzing Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are charmed by Spectator's Paralyzing Ray for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
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
    await mba.createEffect(target.actor, effectData);
}

async function rayFear({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    const effectData = {
        'name': "Spectator: Fear Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are frightened by Spectator's Fear Ray for the duration.</p>
                        <p>You can repeat the saving throw at the end of each of your turns, with disadvantage  ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
        ],
    };
    await mba.createEffect(target.actor, effectData);
}

export let spectator = {
    'rayRoll': rayRoll,
    'rayConfusion': rayConfusion,
    'rayParalyzing': rayParalyzing,
    'rayFear': rayFear

}