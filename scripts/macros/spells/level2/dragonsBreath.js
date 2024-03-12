export async function dragonsBreath({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Dragon\'s Breath: Attack', false);
    if (!featureData) {
        ui.notifications.warn('Missing item in the compendium! (Dragon\'s Breath: Attack)');    
        return;
    }
    let damageTypes  = [
        ['Acid 🧪', 'acid'],
        ['Cold ❄️', 'cold'],
        ['Fire 🔥', 'fire'],
        ['Lightning ⚡', 'lightning'],
        ['Poison ☠️', 'poison']
    ];
    let chooseDamage = await chrisPremades.helpers.dialog('Choose damage type:', damageTypes);
    if (!chooseDamage) {
        ui.notifications.warn('Failed to choose damage type, try again!');
        return;
    }
    let damageValue = 1 + workflow.castData.castLevel;
    let damageParts;
    switch (chooseDamage) {
        case 'acid': {
            damageParts = [[`${damageValue}d6`, "acid"]];
            break;
        }
        case 'cold': {
            damageParts = [[`${damageValue}d6`, "cold"]];
            break;
        }
        case 'fire': {
            damageParts = [[`${damageValue}d6`, "fire"]];
        }
        case 'lightning': {
            damageParts = [[`${damageValue}d6`, "lightning"]];
        }
        case 'poison': {
            damageParts = [[`${damageValue}d6`, "poison"]];
        }
    }
    featureData.system.damage.parts = damageParts;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);

    async function effectMacro () {
        await warpgate.revert(token.document, 'Dragon\'s Breath: Attack');
    }
    let effectData = {
        'label': 'Dragon\'s Breath',
        'icon': 'assets/library/icons/sorted/spells/level2/dragon_breath.webp',
        'description': 'You are imbued with power to spew magical energy from your mouth',
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectData.label]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Dragon\'s Breath: Attack',
        'description': 'Dragon\'s Breath: Attack'
    };
    await warpgate.mutate(target.document, updates, {}, options);
}