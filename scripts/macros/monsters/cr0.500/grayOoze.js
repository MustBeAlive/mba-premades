import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//update when 3.1+ (armor has magic tags)
async function corrodeArmor({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let armorNames = [
        "Breastplate",
        "Chain Mail",
        "Chain Shirt",
        "Half Plate",
        "Plate",
        "Plate Armor",
        "Ring Mail",
        "Scale Mail",
        "Spiked",
        "Splint",
    ];
    let armor = target.actor.items.filter(item => item.system.equipped === true && armorNames.some(armorName => item.name.includes(armorName)) && !item.name.includes("+1") && !item.name.includes("+2") && !item.name.includes("+3"));
    if (!armor.length) return;
    let targetArmor;
    if (armor.length === 1) targetArmor = armor[0];
    if (!targetArmor) [targetArmor] = await mba.selectDocument('Which armor is the right one?', armor);
    if (!targetArmor) return;
    let penalty = 1;
    let corrosionEffect = await mba.findEffect(targetArmor, "Grey Ooze: Corrode Armor");
    if (corrosionEffect) {
        penalty = penalty = corrosionEffect.flags['mba-premades']?.feature?.grayOoze?.corrodeArmor;
        if (targetArmor.system.armor.value - 1 <= 10) {
            ChatMessage.create({
                content: `<p><b>${targetArmor.name}</b> is destroyed by Gray Ooze's Armor Corrosion!</p>`,
                speaker: { actor: workflow.actor }
            });
            targetArmor.delete();
            return;
        }
        let namePenalty = "-" + penalty;
        let newName = targetArmor.name.replace(namePenalty, "-" + (penalty + 1));
        penalty += 1;
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'grayOoze': {
                            'corrodeArmor': penalty
                        }
                    }
                }
            }
        };
        ChatMessage.create({
            content: `<p><b>${targetArmor.name}</b> is being corroded by Gray Ooze's Armor Corrosion!</p><p>New penalty: <b>${penalty}</b></p>`,
            speaker: { actor: workflow.actor }
        });
        await targetArmor.update({ "system.armor.value": targetArmor.system.armor.value - 1 });
        await targetArmor.update({ "name": newName });
        await mba.updateEffect(corrosionEffect, updates);
        return;
    }
    const effectData = {
        'name': "Grey Ooze: Corrode Armor",
        'icon': "modules/mba-premades/icons/generic/generic_acid.webp",
        'description': ``,
        'flags': {
            'mba-premades': {
                'feature': {
                    'grayOoze': {
                        'corrodeArmor': penalty
                    }
                }
            }
        }
    };
    ChatMessage.create({
        content: `<p><b>${targetArmor.name}</b> is being corroded by Gray Ooze's Armor Corrosion!</p><p>Current penalty: <b>${penalty}</b></p>`,
        speaker: { actor: workflow.actor }
    });
    await targetArmor.update({ "system.armor.value": targetArmor.system.armor.value - penalty });
    await targetArmor.update({ "name": targetArmor.name + " -" + penalty });
    await mba.createEffect(targetArmor, effectData);
}

async function corrodeWeapon({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != "weapon" || workflow.item.system.actionType != 'mwak') return;
    let weaponNames = [
        "Battleaxe",
        "Dagger",
        "Double-Bladed Scimitar",
        "Flail",
        "Glaive",
        "Greataxe",
        "Greatsword",
        "Halberd",
        "Handaxe",
        "Hooked Shortspear",
        "Javelin",
        "Lance",
        "Light Hammer",
        "Longsword",
        "Mace",
        "Maul",
        "Morningstar",
        "Pike",
        "Rapier",
        "Scimitar",
        "Shortsword",
        "Sickle",
        "Spear",
        "Trident",
        "War Pick",
        "Warhammer",
        "Yklwa"
    ];
    let valid = weaponNames.some(weaponName => workflow.item.name.includes(weaponName));
    if (!valid) return
    let penalty = 1;
    let corrosionEffect = await mba.findEffect(workflow.item, "Grey Ooze: Corrode Weapon");
    if (corrosionEffect) {
        penalty = corrosionEffect.flags['mba-premades']?.feature?.grayOoze?.corrodeWeapon;
        if ((penalty + 1) > 4) {
            ChatMessage.create({
                content: `<p><b>${workflow.item.name}</b> is destroyed by Gray Ooze's Weapon Corrosion!</p>`,
                speaker: { actor: workflow.actor }
            });
            workflow.item.delete();
            return;
        }
        let damageParts = duplicate(workflow.item.system.damage.parts);
        let damageType = workflow.item.system.damage.parts[0][1];
        let value = "-" + penalty + "[" + damageType + "]";
        let part = damageParts.findIndex(i => i.some(v => v === value));
        let namePenalty = "-" + penalty;
        let newName = workflow.item.name.replace(namePenalty, "-" + (penalty + 1));
        penalty += 1;
        damageParts[part] = ['-' + penalty + '[' + damageType + ']', damageType];
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'grayOoze': {
                            'corrodeWeapon': penalty
                        }
                    }
                }
            }
        };
        ChatMessage.create({
            content: `<p><b>${workflow.item.name}</b> is being corroded by Gray Ooze's Weapon Corrosion!</p><p>New penalty: <b>${penalty}</b></p>`,
            speaker: { actor: workflow.actor }
        });
        await workflow.item.update({ "system.damage.parts": damageParts });
        await workflow.item.update({ "name": newName });
        await mba.updateEffect(corrosionEffect, updates);
        return;
    }
    const effectData = {
        'name': "Grey Ooze: Corrode Weapon",
        'icon': "modules/mba-premades/icons/generic/corrode_weapon.webp",
        'description': ``,
        'flags': {
            'mba-premades': {
                'feature': {
                    'grayOoze': {
                        'corrodeWeapon': penalty
                    }
                }
            }
        }
    };
    let damageParts = duplicate(workflow.item.system.damage.parts);
    let damageType = workflow.item.system.damage.parts[0][1];
    damageParts.push(['-' + penalty + '[' + damageType + ']', damageType]);
    ChatMessage.create({
        content: `<p><b>${workflow.item.name}</b> is being corroded by Gray Ooze's Weapon Corrosion!</p><p>Current penalty: <b>${penalty}</b></p>`,
        speaker: { actor: workflow.actor }
    });
    await workflow.item.update({ "system.damage.parts": damageParts });
    await workflow.item.update({ "name": workflow.item.name + " -" + penalty });
    await mba.createEffect(workflow.item, effectData);
}

async function psychicCrush({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = await mba.findNearby(workflow.token, 60, "enemy", false, false);
    if (!targets.length) {
        ui.notifications.warn("No valid targets within 60 feet!");
        return;
    }
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, targets, false, 'one', undefined, false, "Select single target");
    if (!selection) return;
    let newTarget = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTarget);
}

export let grayOoze = {
    'corrodeArmor': corrodeArmor,
    'corrodeWeapon': corrodeWeapon,
    'psychicCrush': psychicCrush
}