import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Dragon's Breath: Attack", false);
    if (!featureData) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    delete featureData._id;
    let damageTypes = [
        ["Acid", "acid", "modules/mba-premades/icons/spells/level2/dragon_breath_acid.webp"],
        ["Cold", "cold", "modules/mba-premades/icons/spells/level2/dragon_breath_cold.webp"],
        ["Fire", "fire", "modules/mba-premades/icons/spells/level2/dragon_breath_fire.webp"],
        ["Lightning", "lightning", "modules/mba-premades/icons/spells/level2/dragon_breath_lightning.webp"],
        ["Poison", "poison", "modules/mba-premades/icons/spells/level2/dragon_breath_poison.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selectionType = await mba.selectImage("Dragon's Breath", damageTypes, `<b>Choose damage type:</b>`, "both");
    await mba.clearPlayerDialogMessage();
    if (!selectionType.length) {
        ui.notifications.warn("Failed to choose damage type, try again!");
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let damageValue = 1 + workflow.castData.castLevel;
    let damageParts = [[`${damageValue}d6[${selectionType[0]}]`, `${selectionType[0]}`]];
    featureData.img = selectionType[1];
    featureData.system.damage.parts = damageParts;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Dragon's Breath");
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': selectionType[1],
        'origin': workflow.item.uuid,
        'description': `
            <p>You are imbued with power to spew magical energy from your mouth.</p>
            <p>Until the spell ends, you can use an action to exhale ${selectionType[0]} energy in a 15-foot cone.</p>
            <p>Each creature in that area must make a Dexterity saving throw, taking ${damageValue}d6 damage of the chosen type on a failed save, or half as much damage on a successful one.</p>
        `,
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
            },
            'mba-premades': {
                'spell': {
                    'dragonsBreath': {
                        'damageType': selectionType[0]
                    }
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
        'name': "Dragon's Breath",
        'description': "Dragon's Breath"
    };
    await warpgate.mutate(target.document, updates, {}, options);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Dragon's Breath");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Dragon's Breath)");
        return;
    }
    let damageType = effect.flags['mba-premades']?.spell?.dragonsBreath?.damageType;
    let animation;
    let rate;
    let scale;
    switch (damageType) {
        case "acid": {
            animation = "jb2a.breath_weapons02.burst.cone.fire.green.01";
            rate = 1.4;
            scale = 4;
            break;
        }
        case "cold": {
            animation = "jb2a.breath_weapons.cold.cone.blue";
            rate = 1.8;
            scale = 3.8;
            break;
        }
        case "fire": {
            animation = "jb2a.breath_weapons.fire.cone.orange.02";
            rate = 1.5;
            scale = 3.8;
            break;
        }
        case "lightning": {
            animation = "jb2a.template_cone_5e.lightning.01.complete.bluepurple";
            rate = 1.5;
            scale = 4;
            break;
        }
        case "poison": {
            animation = "jb2a.breath_weapons.poison.cone.green";
            rate = 1.5;
            scale = 3.5;
            break;
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scaleToObject(scale)
        .fadeIn(1500)
        .playbackRate(rate)

        .play()
}

export let dragonsBreath = {
    'item': item,
    'attack': attack
}