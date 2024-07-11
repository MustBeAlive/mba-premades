import {mba} from "../../../../helperFunctions.js";

// To do

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let supplies = await mba.getItem(workflow.actor, "Alchemist's Supplies");
    if (!supplies) {
        ui.notifications.warn("Unable to find Alchemist's Supplies!");
        return;
    }
    let flaskItem = await mba.getItem(workflow.actor, "Empty Flask");
    if (!flaskItem) {
        ui.notifications.warn("You don't have an empty flask to make the elixir!");
        return;
    }
    let elixirRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(elixirRoll);
    elixirRoll.toMessage({
        rollMode: 'roll',
        speaker: { alias: name },
        flavor: 'Experimental Elixir'
    });
    let itemName;
    switch (elixirRoll.total) {
        case 1: {
            itemName = "Experimental Elixir: Healing";
            break;
        }
        case 2: {
            itemName = "Experimental Elixir: Swiftness";
            break;
        }
        case 3: {
            itemName = "Experimental Elixir: Resilience";
            break;
        }
        case 4: {
            itemName = "Experimental Elixir: Boldness";
            break;
        }
        case 5: {
            itemName = "Experimental Elixir: Flight";
            break;
        }
        case 6: {
            itemName = "Experimental Elixir: Transformation";
            break;
        }
    }
    if (!itemName) return;
    let feature = await mba.getItem(workflow.actor, itemName);
    if (feature) {
        let ammount = feature.system.quantity;
        await feature.update({ "system.quantity": ammount + 1 });
    }
    else {
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Class Feature Items", itemName, false);
        if (itemName === 'Experimental Elixir: Healing') featureData.system.damage.parts = [[`2d4[healing] + ${workflow.actor.system.abilities.int.mod}[healing]`, 'healing']];
        if (workflow.actor.classes.artificer?.system?.levels >= 9) {
            if (!itemData.system.damage.parts) featureData.system.damage.parts = [];
            featureData.system.damage.parts.push([`2d6[temphp] + ${workflow.actor.system.abilities.int.mod}[temphp]`,'temphp']);
        }
        async function effectMacroDel() {
            await warpgate.revert(token.document, `${feature.name} Item`);
        }
        let effectData = {
            'name': `${featureData.name} Item`,
            'icon': '',
            'origin': workflow.item.uuid,
            'flags': {
                'dae': {
                    'macroRepeat': 'none',
                    'showIcon': false,
                    'specialDuration': ['longRest'],
                    'stackable': 'multi',
                    'transfer': false,
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                },
            }
        };
        let updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': effectData.name,
            'description': effectData.name
        };
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    if (flaskItem.system.quantity > 1) {
        await flaskItem.update({ "system.quantity": flaskItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [flaskItem.id]);
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let itemName = workflow.item.name;
    let target = workflow.targets.first();
    let effectData;
    if (itemName === "Experimental Elixir: Healing") {

    }
    else if (itemName === "Experimental Elixir: Swiftness") {

    }
    else if (itemName === "Experimental Elixir: Resilience") {
        
    }
    else if (itemName === "Experimental Elixir: Boldness") {
        
    }
    else if (itemName === "Experimental Elixir: Flight") {
        
    }
    else if (itemName === "Experimental Elixir: Transformation") {
        
    }
}

export let experimentalElixir = {
    'cast': cast,
    'item': item,
}