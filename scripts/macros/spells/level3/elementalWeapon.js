import {mba} from "../../../helperFunctions.js";

export async function elementalWeapon({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let target = workflow.targets.first();
    let weapons = target.actor.items.filter(i => i.type === 'weapon' && i.system.properties.mgc != true && i.system.equipped && i.name != "Unarmed Strike");
    if (!weapons.length) {
        ui.notifications.warn("Target has no valid non-magical weapons equipped!");
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let weaponItem;
    if (weapons.length === 1) weaponItem = [weapons[0]];
    else weaponItem = await mba.selectDocument(workflow.item.name, weapons);
    if (!weaponItem) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let choices = [
        ["Acid", "acid", "modules/mba-premades/icons/spells/level3/elemental_weapon_acid.webp"],
        ["Cold", "cold", "modules/mba-premades/icons/spells/level3/elemental_weapon_cold.webp"],
        ["Fire", "fire", "modules/mba-premades/icons/spells/level3/elemental_weapon_fire.webp"],
        ["Lightning", "lightning", "modules/mba-premades/icons/spells/level3/elemental_weapon_lightning.webp"],
        ["Thunder", "thunder", "modules/mba-premades/icons/spells/level3/elemental_weapon_thunder.webp"],
    ];
    let selection = await mba.selectImage("Elemental Weapon", choices, `<b>Choose damage type:</b>`, "both");
    if (!selection.length) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let hue = 0;
    switch (selection[0]) {
        case "acid": hue = 200; break;
        case "cold": hue = 280; break;
        case "fire": hue = 95; break;
        case "lightning": hue = 310; break;
        case "thunder": hue = 0; break;
    }
    let castLevel = workflow.castData.castLevel;
    let bonus = 1;
    if (castLevel >= 5 && castLevel < 7) bonus = 2;
    else if (castLevel >= 7) bonus = 3;
    let damageParts = duplicate(weaponItem[0].system.damage.parts);
    damageParts.push([`+ ${bonus}d4[${selection[0]}]`, selection[0]]);
    let versatile = duplicate(weaponItem[0].system.damage.versatile);
    if (versatile != '') versatile += `+ ${bonus}d4[${selection[0]}]`;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EW`, object: token })
        await warpgate.revert(token.document, 'Elemental Weapon');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, <b>${weaponItem[0].name}</b> becomes a magic weapon.</p>
            <p>It gains <b>+${bonus}</b> bonus to attack rolls and deals an extra <b>${bonus}d4 ${selection[0]}</b> damage when it hits.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
                [weaponItem[0].name]: {
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

    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.static.purple.011")
        .attachTo(target)
        .scaleToObject(1.85)
        .fadeIn(1000)
        .fadeOut(1500)
        .belowTokens()
        .filter("ColorMatrix", { hue: hue })
        .persist()
        .name(`${target.document.name} EW`)

        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .play()
}