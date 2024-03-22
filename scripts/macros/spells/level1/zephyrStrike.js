async function attack({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = chrisPremades.helpers.findEffect(workflow.actor, 'Zephyr Strike');
    if (!effect) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let choices  = [
        ['Yes!', 'true'],
        ['No!', 'false']
    ];
    let selection = await chrisPremades.helpers.dialog('Use Zephyr Strike to gain advantage?', choices);
    if (selection === 'false') return;
    let damageBonus = '1d8[force]';
    const effectData = {
        'name': 'Zephyr Strike: Advantage',
        'icon': 'assets/library/icons/sorted/generic/generic_buff.png',
        'duration': {
            'turns': 1
        },
        'flags': {
            'dae': {
                'specialDuration': ['1Attack'],
            },
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.mwak',
                'mode': 2,
                'value': "1",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.attack.rwak',
                'mode': 2,
                'value': "1",
                'priority': 20
            },
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': damageBonus,
                'priority': 20
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': damageBonus,
                'priority': 20
            }
        ]
    }
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
}

async function del(actor) {
    const effectData = {
        'name': "Zephyr Strike: Speed Bonus",
        'description': "You have +30 walking speed until the end of your turn",
        'duration': {
            'turns': 1,
        },
        'icon': "assets/library/icons/sorted/spells/level1/zephyr_strike_move.webp",
        'changes': [
            {   
                'key': "system.attributes.movement.walk", 
                'mode': 2, 
                'value': "+30", 
                'priority': 20
            }
        ],
    }
    await chrisPremades.helpers.createEffect(actor, effectData);
}

export let zephyrStrike = {
    'attack': attack,
    'del': del
}