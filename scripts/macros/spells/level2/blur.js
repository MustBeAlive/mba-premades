async function hook(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    let validTypes = [
        'mwak',
        'rwak',
        'msak',
        'rsak'
    ];
    if (!validTypes.includes(workflow.item.system?.actionType)) return;
    let targetActor = workflow.targets.first().actor;
    let targetEffect = chrisPremades.helpers.findEffect(targetActor, "Blur");
    if (!targetEffect) return;
    let blindsight = workflow.actor.system.attributes.senses.blindsight;
    let truesight = workflow.actor.system.attributes.senses.truesight;
    if (!blindsight && !truesight) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'blur', 50);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add('ADV: Ignores disadvantage from Blur (has Blindsight/Truesight)');
    chrisPremades.queue.remove(workflow.item.uuid);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, any creature has disadvantage on attack rolls against you.</p>
            <p>An attacker is immune to this effect if it doesn't rely on sight, as with <b>blindsight</b>, or can see with through illusion, as with <b>truesight</b>.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.mwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.msak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.rwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.rsak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'macro.tokenMagic',
                'mode': 0,
                'value': "blur",
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

export let blur = {
    'hook': hook,
    'item': item
}