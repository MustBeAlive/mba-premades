import { mba } from "../../../helperFunctions.js";
import { tashaSummon } from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA: Spiritual Weapon");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Spiritual Weapon)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Spiritual Weapon`;
    let damageFormula = workflow.castData.castLevel - 1;
    let attackData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Spiritual Weapon: Attack', false);
    if (!attackData) return;
    attackData.system.damage.parts[0][0] += damageFormula + 'd8' + ' + ' + mba.getSpellMod(workflow.item) + '[force]';
    attackData.system.attackBonus = mba.getSpellMod(workflow.item) + workflow.actor.system.attributes.prof - 2; // cringe
    let selectionStyle;
    let selectionWeapon;
    let selectionColor;
    let selectedImg;
    selectionStyle = await mba.dialog("SW: Style", [
        ['Astral', 'astral.01'],
        ['Dark', 'dark'],
        ['Flaming', 'flaming'],
        ['Liquid', 'liquid.01'],
        ['Spectral', 'spectral']
    ], "<b>Choose style:</b>");
    if (!selectionStyle) return;
    if (selectionStyle === 'astral.01') {
        selectionWeapon = await mba.dialog("SW: Weapon", [
            ['Club', 'club.01.'],
            ['Dagger', 'dagger.02.'],
            ['Falchion', 'falchion.01.'],
            ['Glaive', 'glaive.01.'],
            ['Greataxe', 'greataxe.01.'],
            ['Greatclub', 'greatclub.01.'],
            ['Greatsword', 'greatsword.01.'],
            ['Halberd', 'halberd.01.'],
            ['Hammer', 'hammer.01.'],
            ['Handaxe', 'handaxe.01.'],
            ['Javelin', 'javelin.01.'],
            ['Katana', 'katana.01.'],
            ['Longsword', 'longsword.01.'],
            ['Mace', 'mace.01.'],
            ['Maul', 'maul.01.'],
            ['Quarterstaff', 'quarterstaff.01.'],
            ['Rapier', 'rapier.01.'],
            ['Scimitar', 'scimitar.01.'],
            ['Scythe', 'scythe.01.'],
            ['Shortsword', 'shortsword.01.'],
            ['Spear', 'spear.01.'],
            ['Trident', 'trident.01.'],
            ['Warhammer', 'warhammer.01.'],
            ['Wrench', 'wrench.01.']
        ], "<b>Choose weapon:</b>");
        if (!selectionWeapon) return;
        if (selectionWeapon === 'quarterstaff.01.') {
            let staffSelection = await mba.dialog("SW: Weapon Type", [
                ['Metal Top', 'quarterstaff.01.'],
                ['Wood Top', 'quarterstaff.02.'],
                ['Orb Top', 'quarterstaff.03.'],
                ['Horned Top', 'quarterstaff.04.']
            ], "<b>Choose weapon style:</b>");
            if (!staffSelection) return;
            selectionWeapon = staffSelection;
        }
        selectionColor = await mba.dialog("SW: Color", [
            ['Blue', '.blue'],
            ['Purple', '.purple']
        ], "<b>Choose color:</b>");
        if (!selectionColor) return;
    }
    else if (selectionStyle === 'dark') {
        selectionWeapon = await mba.dialog('SW: Weapon', [
            ['Longsword', 'longsword.01.'],
            ['Scythe', 'scythe.01.'],
            ['Sword', 'sword.']
        ], "<b>Choose weapon:</b>");
        if (!selectionWeapon) return;
        if (selectionWeapon === 'longsword.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.blue'],
                ['Green', '.green'],
                ['Purple', '.purple'],
                ['Red', '.red'],
                ['White', '.white']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'scythe.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.blue'],
                ['Green 1 (older)', '.green'],
                ['Green 2 (newer)', '.green02'],
                ['Pink', '.pink'],
                ['Purple', '.purple'],
                ['Red', '.red'],
                ['White', '.white']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'sword.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.blue'],
                ['Green', '.green'],
                ['Purple', '.purple'],
                ['Red', '.red'],
                ['White', '.white']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        }
    }
    else if (selectionStyle === 'flaming') {
        selectionWeapon = await mba.dialog('SW: Weapon', [
            ['Longsword', 'longsword.01.'],
            ['Mace', 'mace.01.'],
            ['Maul', 'maul.01.'],
            ['Sword', 'sword.']
        ], "<b>Choose weapon:</b>");
        if (!selectionWeapon) return;
        selectionColor = await mba.dialog('SW: Color', [
            ['Blue', '.blue'],
            ['Green', '.green'],
            ['Orange', '.orange'],
            ['Purple', '.purple'],
            ['Red', '.red'],
            ['Yellow', '.yellow']
        ], "<b>Choose color:</b>");
        if (!selectionColor) return;
    }
    else if (selectionStyle === 'liquid.01') {
        selectionWeapon = await mba.dialog('SW: Weapon', [
            ['Club', 'club.01.'],
            ['Dagger', 'dagger.02.'],
            ['Falchion', 'falchion.01.'],
            ['Glaive', 'glaive.01.'],
            ['Greataxe', 'greataxe.01.'],
            ['Greatclub', 'greatclub.01.'],
            ['Greatsword', 'greatsword.01.'],
            ['Halberd', 'halberd.01.'],
            ['Hammer', 'hammer.01.'],
            ['Handaxe', 'handaxe.01.'],
            ['Javelin', 'javelin.01.'],
            ['Katana', 'katana.01.'],
            ['Longsword', 'longsword.01.'],
            ['Mace', 'mace.01.'],
            ['Maul', 'maul.01.'],
            ['Quarterstaff', 'quarterstaff.01.'],
            ['Rapier', 'rapier.01.'],
            ['Scimitar', 'scimitar.01.'],
            ['Scythe', 'scythe.01.'],
            ['Shortsword', 'shortsword.01.'],
            ['Spear', 'spear.01.'],
            ['Trident', 'trident.01.'],
            ['Warhammer', 'warhammer.01.'],
            ['Wrench', 'wrench.01.']
        ], "<b>Choose weapon:</b>");
        if (!selectionWeapon) return;
        if (selectionWeapon === 'quarterstaff.01.') {
            let staffSelection = await mba.dialog('SW: Weapon Type', [
                ['Metal Top', 'quarterstaff.01.'],
                ['Wood Top', 'quarterstaff.02.'],
                ['Orb Top', 'quarterstaff.03.'],
                ['Horned Top', 'quarterstaff.04.']
            ], "<b>Choose weapon style:</b>");
            if (!staffSelection) return;
            selectionWeapon = staffSelection;
        }
        selectionColor = '.blue';
    }
    else if (selectionStyle === 'spectral') {
        selectionWeapon = await mba.dialog('SW: Weapon', [
            ['Club', 'club.01.'],
            ['Dagger', 'dagger.02.'],
            ['Falchion', 'falchion.01.'],
            ['Glaive', 'glaive.01.'],
            ['Greataxe', 'greataxe.01.'],
            ['Greatclub', 'greatclub.01.'],
            ['Greatsword', 'greatsword.01.'],
            ['Halberd', 'halberd.01.'],
            ['Hammer', 'hammer.01.'],
            ['Handaxe', 'handaxe.01.'],
            ['Javelin', 'javelin.01.'],
            ['Katana', 'katana.01.'],
            ['Longsword', 'longsword.01.'],
            ['Mace', 'mace.01.'],
            ['Maul', 'maul.01.'],
            ['Quarterstaff', 'quarterstaff.01.'],
            ['Rapier', 'rapier.01.'],
            ['Scimitar', 'scimitar.01.'],
            ['Scythe', 'scythe.01.'],
            ['Shortsword', 'shortsword.01.'],
            ['Sword', 'sword.'],
            ['Spear', 'spear.01.'],
            ['Trident', 'trident.01.'],
            ['Warhammer', 'warhammer.01.'],
            ['Wrench', 'wrench.01.']
        ], "<b>Choose weapon:</b>");
        if (!selectionWeapon) return;
        if (selectionWeapon === 'longsword.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.01.blue'],
                ['Green 1 (older)', '.01.green'],
                ['Green 2 (newer)', '.02.green'],
                ['Orange', '.01.orange'],
                ['Purple', '.01.purple'],
                ['Red', '.01.red']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'mace.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.01.blue'],
                ['Green 1 (older)', '.01.green'],
                ['Green 2 (newer)', '.02.green'],
                ['Orange', '.01.orange'],
                ['Purple', '.01.purple'],
                ['Red', '.01.red']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'maul.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.01.blue'],
                ['Green 1 (older)', '.01.green'],
                ['Green 2 (newer)', '.02.green'],
                ['Orange', '.01.orange'],
                ['Purple', '.01.purple'],
                ['Red', '.01.red']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'quarterstaff.01.') {
            let staffSelection = await mba.dialog('SW: Weapon Type', [
                ['Metal Top', 'quarterstaff.01.'],
                ['Wood Top', 'quarterstaff.02.'],
                ['Orb Top', 'quarterstaff.03.'],
                ['Horned Top', 'quarterstaff.04.']
            ], "<b>Choose weapon style:</b>");
            if (!staffSelection) return;
            selectionWeapon = staffSelection;
            selectionColor = '.02.green';
        } else if (selectionWeapon === 'scythe.01.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.01.blue'],
                ['Green 1 (older)', '.01.green'],
                ['Green 2 (newer)', '.02.green'],
                ['Orange', '.01.orange'],
                ['Purple', '.01.purple'],
                ['Red', '.01.red'],
                ['White', '.01.white']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else if (selectionWeapon === 'sword.') {
            selectionColor = await mba.dialog('SW: Color', [
                ['Blue', '.blue'],
                ['Green', '.green'],
                ['Orange', '.orange'],
                ['Purple', '.purple'],
                ['Red', '.red']
            ], "<b>Choose color:</b>");
            if (!selectionColor) return;
        } else {
            selectionColor = await mba.dialog('SW: Color', [
                ['Orange', '.02.orange'],
                ['Green', '.02.green']
            ], "<b>Choose color:</b>");
        }
    }
    selectedImg = 'jb2a.spiritual_weapon.' + selectionWeapon + selectionStyle + selectionColor;
    selectedImg = await Sequencer.Database.getEntry(selectedImg).file;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
                'name': tokenName,
                'texture': {
                    'src': selectedImg
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
            'texture': {
                'src': selectedImg
            }
        },
        'embedded': {
            'Item': {
                [attackData.name]: attackData
            }
        }
    };
    let spawned = await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, "celestial", {}, workflow.castData.castLevel);
    let weaponType = selectionWeapon.replace(/[0-9.]/g, '');
    console.log(weaponType);
    let spawnedEffect = await mba.findEffect(spawned.actor, `${workflow.token.document.name} Spiritual Weapon`);
    if (!spawnedEffect) return;
    let spawnedUpdates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'spiritualWeapon': {
                        'weaponType': weaponType
                    }
                }
            }
        }
    };
    await mba.updateEffect(spawnedEffect, spawnedUpdates);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, workflow.actor.name);
    let weaponType = effect.flags['mba-premades']?.spell?.spiritualWeapon?.weaponType;
    let attackAnimation;
    switch (weaponType) {
        case "club": attackAnimation = "jb2a.club.melee.01.white"; break;
        case "dagger": attackAnimation = "jb2a.dagger.melee.02.white"; break;
        case "falchion": attackAnimation = "jb2a.falchion.melee.01.white"; break;
        case "glaive": attackAnimation = "jb2a.glaive.melee.01.white"; break;
        case "greataxe": attackAnimation = "jb2a.greataxe.melee.standard.white"; break;
        case "greatsword": attackAnimation = "jb2a.greatsword.melee.standard.white"; break;
        case "halberd": attackAnimation = "jb2a.halberd.melee.01.white"; break;
        case "hammer": attackAnimation = "jb2a.hammer.melee.01.white"; break;
        case "handaxe": attackAnimation = "jb2a.handaxe.melee.standard.white"; break;
        case "javelin": attackAnimation = "jb2a.javelin.01.throw"; break;
        case "katana": attackAnimation = "jb2a.melee_attack.04.katana.01"; break;
        case "longsword": attackAnimation = "jb2a.greatsword.melee.standard.white"; break;
        case "mace": attackAnimation = "jb2a.mace.melee.01.white"; break;
        case "maul": attackAnimation = "jb2a.maul.melee.standard.white"; break;
        case "quarterstaff": attackAnimation = "jb2a.quarterstaff.melee.02.white"; break;
        case "rapier": attackAnimation = "jb2a.rapier.melee.01.white"; break;
        case "scimitar": attackAnimation = "jb2a.scimitar.melee.01.white"; break;
        case "scythe": attackAnimation = "jb2a.melee_attack.05.scythe.01"; break;
        case "shortsword": attackAnimation = "jb2a.shortsword.melee.01.white"; break;
        case "sword": attackAnimation = "jb2a.greatsword.melee.standard.white"; break;
        case "spear": attackAnimation = "jb2a.spear.melee.01.white"; break;
        case "trident": attackAnimation = "jb2a.spear.melee.01.white"; break;
        case "warhammer": attackAnimation = "jb2a.warhammer.melee.01.white"; break;
        case "wrench": attackAnimation = "jb2a.wrench.melee.01.white"; 
    }
    new Sequence()
    
        .effect()
        .file(attackAnimation)
        .attachTo(token)
        .stretchTo(target)
        .mirrorY()
        .size(1.2)
    
        .play()
}

export let spiritualWeapon = {
    'item': item,
    'attack': attack
}