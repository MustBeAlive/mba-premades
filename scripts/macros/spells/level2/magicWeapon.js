export async function magicWeapon({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();
    let weapons = target.actor.items.filter(i => i.type === 'weapon' && i.system.properties.mgc != true && i.system.equipped);
    if (!weapons.length) {
        ui.notifications.warn('Target has no valid non-magical equipped weapons!');
        return;
    }
    let selection;
    if (weapons.length === 1) {
        selection = [weapons[0]];
    } else {
        selection = await chrisPremades.helpers.selectDocument(workflow.item.name, weapons);
        if (!selection) return;
    }
    let castLevel = workflow.castData.castLevel;
    let bonus = 1;
    if (castLevel >= 4 && castLevel < 6) {
        bonus = 2;
    } else if (castLevel >= 6) {
        bonus = 3;
    }
    let damageType = selection[0].system.damage.parts[0][1];
    let damageParts = duplicate(selection[0].system.damage.parts);
    damageParts.push(['+' + bonus + '[' + damageType + ']', damageType]);
    let versatile = duplicate(selection[0].system.damage.versatile);
    if (versatile != '') versatile += '+' + bonus + '[' + damageType + ']';
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Magic Weapon');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Until the spell ends, one weapon of caster's choosing becomes a magic weapon with a +${bonus} bonus to attack rolls and damage rolls.`,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
                [selection[0].name]: {
                    'system': {
                        'damage': {
                            'parts': damageParts,
                            'versatile': versatile
                        },
                        'attackBonus': bonus,
                        'properties': {
                            'mgc': true
                        }
                    }
                }
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Magic Weapon',
        'description': 'Magic Weapon'
    };
    await warpgate.mutate(target.document, updates, {}, options);
}