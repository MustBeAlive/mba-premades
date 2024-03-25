export async function elementalWeapon({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size != 1) return;
    let targetToken = workflow.targets.first();
    let targetActor = targetToken.actor;
    let weapons = targetActor.items.filter(i => i.type === 'weapon' && i.system.properties.mgc != true && i.system.equipped);
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
    let damageType = await chrisPremades.helpers.dialog(workflow.item.name, [['Acid 🧪', 'acid'], ['Cold ❄️', 'cold'], ['Fire 🔥', 'fire'], ['Lightning ⚡', 'lightning'], ['Thunder ☁️', 'thunder']], 'Choose damage type:');
    if (!damageType) return;
    let icon;
    switch (damageType) {
        case 'acid': {
            icon = "assets/library/icons/sorted/spells/level3/elemental_weapon_acid.webp";
            break;
        }
        case 'cold': {
            icon = "assets/library/icons/sorted/spells/level3/elemental_weapon_cold.webp";
            break;
        }
        case 'fire': {
            icon = "assets/library/icons/sorted/spells/level3/elemental_weapon_fire.webp";
            break;
        }
        case 'lightning': {
            icon = "assets/library/icons/sorted/spells/level3/elemental_weapon_lightning.webp";
            break;
        }
        case 'thunder': {
            icon = "assets/library/icons/sorted/spells/level3/elemental_weapon_thunder.webp";
        }
    }
    let castLevel = workflow.castData.castLevel;
    let bonus = 1;
    if (castLevel >= 5 && castLevel < 7) {
        bonus = 2;
    } else if (castLevel > 6) {
        bonus = 3;
    }
    let damageParts = duplicate(selection[0].system.damage.parts);
    damageParts.push(['+' + bonus + 'd4[' + damageType + ']', damageType]);
    let versatile = duplicate(selection[0].system.damage.versatile);
    if (versatile != '') versatile += ' + ' + bonus + 'd4[' + damageType + ']';
    async function effectMacro() {
        await warpgate.revert(token.document, 'Elemental Weapon');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': icon,
        'description': `Until the spell ends, one weapon of caster's choosing becomes a magic weapon with a +${bonus} bonus to attack rolls and deals an extra ${bonus}d4 ${damageType} damage when it hits.`,
        'duration': {
            'seconds': 3600
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
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
        'name': 'Elemental Weapon',
        'description': 'Elemental Weapon'
    };
    await warpgate.mutate(targetToken.document, updates, {}, options);
}