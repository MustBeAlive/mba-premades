import {mba} from "../../../../helperFunctions.js";

// WIP
// To do:
// - Make an effect for Artificer ("Infusion Active" tracker)
// - Make the resistance effect non-warpgate; make it apply to the item and not the token
// -

export async function resistantArmor({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(target.actor, "Resistant Armor");
    if (effect) await mba.removeEffect(effect);
    await warpgate.wait(200);
    let armor = target.actor.items.filter(i => i.system?.armor?.type === "light" || i.system?.armor?.type === "medium" || i.system?.armor?.type === "heavy" ).filter(item => !item.system.equipped);
    if (!armor.length) {
        ui.notifications.warn("Unable to find valid armor (it needs to be unequipped)");
        return;
    }
    let selectionItem;
    await mba.playerDialogMessage(game.user);
    [selectionItem] = await mba.selectDocument('Resistant Armor: Select Armor:', armor);
    await mba.clearPlayerDialogMessage();
    if (!selectionItem) return;
    let armorData = duplicate(selectionItem.toObject());
    armorData.system.attunement = 1;
    let choicesElement = [
        ['Acid', 'acid', "modules/mba-premades/icons/generic/generic_acid.webp"],
        ['Cold', 'cold', "modules/mba-premades/icons/generic/generic_cold.webp"],
        ['Fire', 'fire', "modules/mba-premades/icons/generic/generic_fire.webp"],
        ['Force', 'force', "modules/mba-premades/icons/generic/generic_force.webp"],
        ['Lightning', 'lightning', "modules/mba-premades/icons/generic/generic_lightning.webp"],
        ['Necrotic', 'necrotic', "modules/mba-premades/icons/generic/generic_necrotic.webp"],
        ['Poison', 'poison', "modules/mba-premades/icons/generic/generic_poison.webp"],
        ['Psychic', 'psychic', "modules/mba-premades/icons/generic/generic_psychic.webp"],
        ['Radiant', 'radiant', "modules/mba-premades/icons/generic/generic_radiant.webp"],
        ['Thunder', 'thunder', "modules/mba-premades/icons/generic/generic_thunder.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selectionElement = await mba.selectImage("Resistant Armor: Element", choicesElement, `<b>Choose element:</b>`, "both");
    await mba.clearPlayerDialogMessage();
    if (!selectionElement.length) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Resistant Armor');
    }
    let effectData = {
        'name': "Resistant Armor",
        'icon': selectionElement[1],
        'origin': workflow.item.uuid,
        'description': `
            <p>Bla bla resistance to ${selectionElement[0]} damage.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': selectionElement[0],
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    armorData.effects = effectData;
    let updates = {
        'embedded': {
            'Item': {
                [armorData.name]: armorData
            },
            /*'ActiveEffect': {
                [effectData.name]: effectData
            }*/
        }
    };
    let options = {
        'permanent': false,
        'name': 'Resistant Armor',
        'description': 'Resistant Armor'
    };
    await warpgate.mutate(target.document, updates, {}, options);
}