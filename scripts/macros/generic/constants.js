const advantageEffectData = {
    'name': 'Save Advantage',
    'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
    'description': "You have advantage on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.advantage.ability.save.all',
            'value': '1',
            'mode': 5,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        }
    }
};

const immunityEffectData = {
    'name': 'Save Immunity',
    'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
    'description': "You succeed on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.min.ability.save.all',
            'value': '100',
            'mode': 2,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        }
    }
};

const disadvantageEffectData = {
    'name': 'Save Disadvantage',
    'icon': 'modules/mba-premades/icons/generic/generic_debuff.webp',
    'description': "You have disadvantage on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.disadvantage.ability.save.all',
            'value': '1',
            'mode': 5,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        }
    }
};

function syntheticItemWorkflowOptions(targets, useSpellSlot, castLevel, consume) {
    return [
        {
            'showFullCard': false,
            'createWorkflow': true,
            'consumeResource': consume ?? false,
            'consumeRecharge': consume ?? false,
            'consumeQuantity': consume ?? false,
            'consumeUsage': consume ?? false,
            'consumeSpellSlot': useSpellSlot ?? false,
            'consumeSpellLevel': castLevel ?? false,
            'slotLevel': castLevel ?? false
        },
        {
            'targetUuids': targets,
            'configureDialog': false,
            'workflowOptions': {
                'autoRollDamage': 'always',
                'autoFastDamage': true,
                'autoRollAttack': true
            }
        }
    ];
}

function damageTypeMenu() {
    return Object.entries(CONFIG.DND5E.damageTypes).filter(i => i[0] != 'midi-none').map(j => [j[1].label, j[0]]);
}

const attacks = [
    'mwak',
    'rwak',
    'msak',
    'rsak'
];

const meleeAttacks = [
    'mwak',
    'msak'
];

const rangedAttacks = [
    'rwak',
    'rsak'
];

const weaponAttacks = [
    'mwak',
    'rwak'
];

const spellAttacks = [
    'msak',
    'rsak'
];

const yesNo = [
    ['Yes', true],
    ['No', false]
];

const okCancel = [
    {
        'label': 'Cancel',
        'value': false
    },
    {
        'label': 'Ok',
        'value': true
    }
];

const yesNoButton = [
    {
        'label': 'No',
        'value': false
    },
    {
        'label': 'Yes',
        'value': true
    }
];

const nonDamageTypes = [
    'healing',
    'temphp',
    'midi-none'
];

export let constants = {
    'syntheticItemWorkflowOptions': syntheticItemWorkflowOptions,
    'advantageEffectData': advantageEffectData,
    'disadvantageEffectData': disadvantageEffectData,
    'immunityEffectData': immunityEffectData,
    'damageTypeMenu': damageTypeMenu,
    'attacks': attacks,
    'yesNo': yesNo,
    'okCancel': okCancel,
    'meleeAttacks': meleeAttacks,
    'rangedAttacks': rangedAttacks,
    'weaponAttacks': weaponAttacks,
    'spellAttacks': spellAttacks,
    'yesNoButton': yesNoButton,
    'nonDamageTypes': nonDamageTypes
};