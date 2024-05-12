import {mba} from "../../../helperFunctions.js";

export async function dragonsBreath({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Dragon's Breath: Attack", false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Dragon's Breath: Attack)");
        return;
    }
    delete featureData._id;
    let damageTypes = [
        ['Acid 🧪', 'acid'],
        ['Cold ❄️', 'cold'],
        ['Fire 🔥', 'fire'],
        ['Lightning ⚡', 'lightning'],
        ['Poison ☠️', 'poison']
    ];
    let chooseDamage = await mba.dialog("Dragon's Breath", damageTypes, `<b>Choose damage type:</b>`);
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
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Dragon's Breath: Attack");
    }
    let effectData = {
        'label': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': 'You are imbued with power to spew magical energy from your mouth',
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
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
                [effectData.name]: effectData
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