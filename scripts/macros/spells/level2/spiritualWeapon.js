import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA: Spiritual Weapon");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Spiritual Weapon)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Spiritual Weapon`;
    let damageFormula = workflow.castData.castLevel - 1;
    let attackData = await mba.getItemFromCompendium("mba-premades.MBA Summon Features", "Spiritual Weapon: Attack", false);
    if (!attackData) return;
    attackData.system.damage.parts[0][0] += damageFormula + "d8" + " + " + mba.getSpellMod(workflow.item) + "[force]";
    attackData.system.attackBonus = mba.getSpellMod(workflow.item) + workflow.actor.system.attributes.prof - 2; // cringe
    let selectionStyle;
    let selectionWeaponOptions;
    let selectionWeapon;
    let selectionColorOptions;
    let selectionColor;
    let selectedImg;
    let selectionStyleOptions = [
        ["Astral", "astral.01", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Purple_Thumb.webp"],
        ["Dark", "dark", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Red_Thumb.webp"],
        ["Flaming", "flaming", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Orange_Thumb.webp"],
        ["Liquid", "liquid.01", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Liquid_Blue_Thumb.webp"],
        ["Spectral", "spectral", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_02_Spectral_Green_Thumb.webp"]
    ];
    await mba.playerDialogMessage();
    selectionStyle = await mba.selectImage("Spiritual Weapon: Style", selectionStyleOptions, "<b>Choose style:</b>", "value");
    if (!selectionStyle) {
        await mba.clearPlayerDialogMessage();
        return;
    }
    if (selectionStyle === "astral.01") {
        selectionWeaponOptions = [
            ["Club", "club.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_01_Astral_Purple_Thumb.webp"],
            ["Dagger", "dagger.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_01_Astral_Purple_Thumb.webp"],
            ["Falchion", "falchion.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_01_Astral_Purple_Thumb.webp"],
            ["Glaive", "glaive.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_01_Astral_Purple_Thumb.webp"],
            ["Greataxe", "greataxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_01_Astral_Purple_Thumb.webp"],
            ["Greatclub", "greatclub.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_01_Astral_Purple_Thumb.webp"],
            ["Greatsword", "greatsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_01_Astral_Purple_Thumb.webp"],
            ["Halberd", "halberd.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_01_Astral_Purple_Thumb.webp"],
            ["Hammer", "hammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_01_Astral_Purple_Thumb.webp"],
            ["Handaxe", "handaxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_01_Astral_Purple_Thumb.webp"],
            ["Javelin", "javelin.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_01_Astral_Purple_Thumb.webp"],
            ["Katana", "katana.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_01_Astral_Purple_Thumb.webp"],
            ["Longsword", "longsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Purple_Thumb.webp"],
            ["Mace", "mace.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Astral_Purple_Thumb.webp"],
            ["Maul", "maul.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Astral_Purple_Thumb.webp"],
            ["Quarterstaff", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Astral_Purple_Thumb.webp"],
            ["Rapier", "rapier.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Astral_Purple_Thumb.webp"],
            ["Scimitar", "scimitar.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_01_Astral_Purple_Thumb.webp"],
            ["Scythe", "scythe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_01_Astral_Purple_Thumb.webp"],
            ["Shortsword", "shortsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Astral_Purple_Thumb.webp"],
            ["Spear", "spear.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_01_Astral_Purple_Thumb.webp"],
            ["Trident", "trident.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_01_Astral_Purple_Thumb.webp"],
            ["Warhammer", "warhammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_01_Astral_Purple_Thumb.webp"],
            ["Wrench", "wrench.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_01_Astral_Purple_Thumb.webp"]
        ];
        selectionWeapon = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionWeaponOptions, "<b>Choose weapon type:</b>", "value");
        if (!selectionWeapon) return;
        if (selectionWeapon === "club.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "dagger.02.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "falchion.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "glaive.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greataxe.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greatclub.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greatsword.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "halberd.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "hammer.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "handaxe.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "javelin.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "katana.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "longsword.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "mace.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "maul.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "quarterstaff.01.") {
            let selectionStaffOptions = [
                ["Wood Top", "quarterstaff.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_01_Astral_Purple_Thumb.webp"],
                ["Metal Top", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Astral_Purple_Thumb.webp"],
                ["Orb Top", "quarterstaff.03.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_01_Astral_Purple_Thumb.webp"],
                ["Horned Top", "quarterstaff.04.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_01_Astral_Purple_Thumb.webp"]
            ];
            let selectionStaff = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionStaffOptions, "<b>Choose weapon style:</b>", "value");
            if (!selectionStaff) return;
            selectionWeapon = selectionStaff;
            if (selectionStaff === "quarterstaff.01.") {
                selectionColorOptions = [
                    ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Astral_Blue_Thumb.webp"],
                    ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Astral_Purple_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.02.") {
                selectionColorOptions = [
                    ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_01_Astral_Blue_Thumb.webp"],
                    ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_01_Astral_Purple_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.03.") {
                selectionColorOptions = [
                    ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_01_Astral_Blue_Thumb.webp"],
                    ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_01_Astral_Purple_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.04.") {
                selectionColorOptions = [
                    ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_01_Astral_Blue_Thumb.webp"],
                    ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_01_Astral_Purple_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
        }
        else if (selectionWeapon === "rapier.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "scimitar.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "scythe.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "shortsword.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "spear.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "trident.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "warhammer.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "wrench.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_01_Astral_Blue_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_01_Astral_Purple_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
    }
    else if (selectionStyle === "dark") {
        selectionWeaponOptions = [
            ["Longsword", "longsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Red_Thumb.webp"],
            ["Scythe", "scythe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Red_Thumb.webp"]
        ];
        selectionWeapon = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionWeaponOptions, "<b>Choose weapon type:</b>", "value");
        if (!selectionWeapon) return;
        if (selectionWeapon === "longsword.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Blue_Thumb.webp"],
                ["Green", ".green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Green_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Purple_Thumb.webp"],
                ["Red", ".red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_Red_Thumb.webp"],
                ["White", ".white", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Dark_White_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        } else if (selectionWeapon === "scythe.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Blue_Thumb.webp"],
                ["Green 1", ".green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Green_Thumb.webp"],
                ["Green 2", ".green02", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Green02_Thumb.webp"],
                ["Pink", ".pink", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Pink_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Purple_Thumb.webp"],
                ["Red", ".red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_Red_Thumb.webp"],
                ["White", ".white", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Dark_White_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
    }
    else if (selectionStyle === "flaming") {
        selectionWeaponOptions = [
            ["Longsword", "longsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Orange_Thumb.webp"],
            ["Mace", "mace.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Orange_Thumb.webp"],
            ["Maul", "maul.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Orange_Thumb.webp"]
        ];
        selectionWeapon = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionWeaponOptions, "<b>Choose weapon type:</b>", "value");
        if (selectionWeapon === "longsword.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Blue_Thumb.webp"],
                ["Green", ".green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Green_Thumb.webp"],
                ["Orange", ".orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Orange_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Purple_Thumb.webp"],
                ["Red", ".red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Red_Thumb.webp"],
                ["Yellow", ".yellow", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Flaming_Yellow_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "mace.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Blue_Thumb.webp"],
                ["Green", ".green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Green_Thumb.webp"],
                ["Orange", ".orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Orange_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Purple_Thumb.webp"],
                ["Red", ".red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Red_Thumb.webp"],
                ["Yellow", ".yellow", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Yellow_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "maul.01.") {
            selectionColorOptions = [
                ["Blue", ".blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Blue_Thumb.webp"],
                ["Green", ".green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Green_Thumb.webp"],
                ["Orange", ".orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Orange_Thumb.webp"],
                ["Purple", ".purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Purple_Thumb.webp"],
                ["Red", ".red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Red_Thumb.webp"],
                ["Yellow", ".yellow", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Flaming_Yellow_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
    }
    else if (selectionStyle === "liquid.01") {
        selectionWeaponOptions = [
            ["Club", "club.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_01_Liquid_Blue_Thumb.webp"],
            ["Dagger", "dagger.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_01_Liquid_Blue_Thumb.webp"],
            ["Falchion", "falchion.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_01_Liquid_Blue_Thumb.webp"],
            ["Glaive", "glaive.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_01_Liquid_Blue_Thumb.webp"],
            ["Greataxe", "greataxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_01_Liquid_Blue_Thumb.webp"],
            ["Greatclub", "greatclub.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_01_Liquid_Blue_Thumb.webp"],
            ["Greatsword", "greatsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_01_Liquid_Blue_Thumb.webp"],
            ["Halberd", "halberd.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_01_Liquid_Blue_Thumb.webp"],
            ["Hammer", "hammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_01_Liquid_Blue_Thumb.webp"],
            ["Handaxe", "handaxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_01_Liquid_Blue_Thumb.webp"],
            ["Javelin", "javelin.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_01_Liquid_Blue_Thumb.webp"],
            ["Katana", "katana.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_01_Liquid_Blue_Thumb.webp"],
            ["Longsword", "longsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Liquid_Blue_Thumb.webp"],
            ["Mace", "mace.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Liquid_Blue_Thumb.webp"],
            ["Maul", "maul.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Liquid_Blue_Thumb.webp"],
            ["Quarterstaff", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Liquid_Blue_Thumb.webp"],
            ["Rapier", "rapier.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Liquid_Blue_Thumb.webp"],
            ["Scimitar", "scimitar.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_01_Liquid_Blue_Thumb.webp"],
            ["Scythe", "scythe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_01_Liquid_Blue_Thumb.webp"],
            ["Shortsword", "shortsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Liquid_Blue_Thumb.webp"],
            ["Spear", "spear.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_01_Liquid_Blue_Thumb.webp"],
            ["Trident", "trident.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_01_Liquid_Blue_Thumb.webp"],
            ["Warhammer", "warhammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_01_Liquid_Blue_Thumb.webp"],
            ["Wrench", "wrench.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_01_Liquid_Blue_Thumb.webp"]
        ];
        selectionWeapon = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionWeaponOptions, "<b>Choose weapon type:</b>", "value");
        if (!selectionWeapon) return;
        if (selectionWeapon === "quarterstaff.01.") {
            let selectionStaffOptions = [
                ["Wood Top", "quarterstaff.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_01_Liquid_Blue_Thumb.webp"],
                ["Metal Top", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_01_Liquid_Blue_Thumb.webp"],
                ["Orb Top", "quarterstaff.03.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_01_Liquid_Blue_Thumb.webp"],
                ["Horned Top", "quarterstaff.04.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_01_Liquid_Blue_Thumb.webp"]
            ];
            let selectionStaff = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionStaffOptions, "<b>Choose weapon style:</b>", "value");
            if (!selectionStaff) return;
            selectionWeapon = selectionStaff;
        }
        selectionColor = ".blue";
    }
    else if (selectionStyle === "spectral") {
        selectionWeaponOptions = [
            ["Club", "club.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_02_Spectral_Green_Thumb.webp"],
            ["Dagger", "dagger.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_02_Spectral_Green_Thumb.webp"],
            ["Falchion", "falchion.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_02_Spectral_Green_Thumb.webp"],
            ["Glaive", "glaive.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_02_Spectral_Green_Thumb.webp"],
            ["Greataxe", "greataxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_02_Spectral_Green_Thumb.webp"],
            ["Greatclub", "greatclub.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_02_Spectral_Green_Thumb.webp"],
            ["Greatsword", "greatsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_02_Spectral_Green_Thumb.webp"],
            ["Halberd", "halberd.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_02_Spectral_Green_Thumb.webp"],
            ["Hammer", "hammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_02_Spectral_Green_Thumb.webp"],
            ["Handaxe", "handaxe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_02_Spectral_Green_Thumb.webp"],
            ["Javelin", "javelin.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_02_Spectral_Green_Thumb.webp"],
            ["Katana", "katana.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_02_Spectral_Green_Thumb.webp"],
            ["Longsword", "longsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_02_Spectral_Green_Thumb.webp"],
            ["Mace", "mace.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_02_Spectral_Green_Thumb.webp"],
            ["Maul", "maul.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_02_Spectral_Green_Thumb.webp"],
            ["Quarterstaff", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_02_Spectral_Green_Thumb.webp"],
            ["Rapier", "rapier.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_02_Spectral_Green_Thumb.webp"],
            ["Scimitar", "scimitar.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_02_Spectral_Green_Thumb.webp"],
            ["Scythe", "scythe.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Green_Thumb (2).webp"],
            ["Shortsword", "shortsword.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_02_Spectral_Green_Thumb.webp"],
            ["Spear", "spear.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_02_Spectral_Green_Thumb.webp"],
            ["Trident", "trident.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_02_Spectral_Green_Thumb.webp"],
            ["Warhammer", "warhammer.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_02_Spectral_Green_Thumb.webp"],
            ["Wrench", "wrench.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_02_Spectral_Green_Thumb.webp"]
        ];
        selectionWeapon = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionWeaponOptions, "<b>Choose weapon type:</b>", "value");
        if (!selectionWeapon) return;
        if (selectionWeapon === "club.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Club01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "dagger.02.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "falchion.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Falchion01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "glaive.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Glaive01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greataxe.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatAxe01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greatclub.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatClub01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "greatsword.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_GreatSword01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "halberd.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Halberd01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "hammer.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Hammer01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "handaxe.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_HandAxe01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "javelin.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Javelin01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "katana.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Katana01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "longsword.01.") {
            selectionColorOptions = [
                ["Blue", ".01.blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Spectral_Blue_Thumb.webp"],
                ["Green 1", ".01.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Spectral_Green_Thumb.webp"],
                ["Green 2", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_02_Spectral_Green_Thumb.webp"],
                ["Orange 1", ".01.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Spectral_Orange_Thumb.webp"],
                ["Orange 2", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_02_Spectral_Orange_Thumb.webp"],
                ["Purple", ".01.purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Spectral_Purple_Thumb.webp"],
                ["Red", ".01.red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Sword01_01_Spectral_Red_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "mace.01.") {
            selectionColorOptions = [
                ["Blue", ".01.blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_Thumb.webp"],
                ["Green 1", ".01.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Green_Thumb.webp"],
                ["Green 2", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_02_Spectral_Green_Thumb.webp"],
                ["Orange 1", ".01.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Orange_Thumb.webp"],
                ["Orange 2", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_02_Spectral_Orange_Thumb.webp"],
                ["Purple", ".01.purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Purple_Thumb.webp"],
                ["Red", ".01.red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Red_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "maul.01.") {
            selectionColorOptions = [
                ["Blue", ".01.blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Spectral_Blue_Thumb.webp"],
                ["Green 1", ".01.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Spectral_Green_Thumb.webp"],
                ["Green 2", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_02_Spectral_Green_Thumb.webp"],
                ["Orange 1", ".01.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Spectral_Orange_Thumb.webp"],
                ["Orange 2", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_02_Spectral_Orange_Thumb.webp"],
                ["Purple", ".01.purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Spectral_Purple_Thumb.webp"],
                ["Red", ".01.red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Maul01_01_Spectral_Red_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "quarterstaff.01.") {
            let selectionStaffOptions = [
                ["Wood Top", "quarterstaff.02.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_02_Spectral_Green_Thumb.webp"],
                ["Metal Top", "quarterstaff.01.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_02_Spectral_Green_Thumb.webp"],
                ["Orb Top", "quarterstaff.03.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_02_Spectral_Green_Thumb.webp"],
                ["Horned Top", "quarterstaff.04.", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_02_Spectral_Green_Thumb.webp"]
            ];
            let selectionStaff = await mba.selectImage("Spiritual Weapon: Weapon Type", selectionStaffOptions, "<b>Choose weapon style:</b>", "value");
            if (!selectionStaff) return;
            selectionWeapon = selectionStaff;
            if (selectionStaff === "quarterstaff.02.") {
                selectionColorOptions = [
                    ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_02_Spectral_Green_Thumb.webp"],
                    ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff02_02_Spectral_Orange_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.01.") {
                selectionColorOptions = [
                    ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_02_Spectral_Green_Thumb.webp"],
                    ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff01_02_Spectral_Orange_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.03.") {
                selectionColorOptions = [
                    ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_02_Spectral_Green_Thumb.webp"],
                    ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff03_02_Spectral_Orange_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
            else if (selectionStaff === "quarterstaff.04.") {
                selectionColorOptions = [
                    ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_02_Spectral_Green_Thumb.webp"],
                    ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_02_Spectral_Orange_Thumb.webp"]
                ];
                selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
                if (!selectionColor) return;
            }
        }
        else if (selectionWeapon === "rapier.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "scimitar.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scimitar01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "scythe.01.") {
            selectionColorOptions = [
                ["Blue", ".01.blue", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Blue_Thumb.webp"],
                ["Green 1", ".01.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Green_Thumb.webp"],
                ["Green 2", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Green_Thumb (2).webp"],
                ["Orange 1", ".01.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Orange_Thumb.webp"],
                ["Orange 2", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Orange_Thumb (2).webp"],
                ["Purple", ".01.purple", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Purple_Thumb.webp"],
                ["Red", ".01.red", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_Red_Thumb.webp"],
                ["White", ".01.white", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Scythe01_02_Spectral_White_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "shortsword.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "spear.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Spear01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "trident.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Trident01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "warhammer.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Warhammer01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
        else if (selectionWeapon === "wrench.01.") {
            selectionColorOptions = [
                ["Green", ".02.green", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_02_Spectral_Green_Thumb.webp"],
                ["Orange", ".02.orange", "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Wrench01_02_Spectral_Orange_Thumb.webp"]
            ];
            selectionColor = await mba.selectImage("Spiritual Weapon: Color", selectionColorOptions, "<b>Choose weapon color:</b>", "value");
            if (!selectionColor) return;
        }
    }
    await mba.clearPlayerDialogMessage();
    selectedImg = "jb2a.spiritual_weapon." + selectionWeapon + selectionStyle + selectionColor;
    selectedImg = await Sequencer.Database.getEntry(selectedImg).file;
    if (!selectedImg) {
        ui.notifications.warn("Unable to find the .webm file, try again!");
        return;
    }
    let updates = {
        "actor": {
            "name": tokenName,
            "prototypeToken": {
                "disposition": workflow.token.document.disposition,
                "name": tokenName,
                "texture": {
                    "src": selectedImg
                }
            }
        },
        "token": {
            "disposition": workflow.token.document.disposition,
            "name": tokenName,
            "texture": {
                "src": selectedImg
            }
        },
        "embedded": {
            "Item": {
                [attackData.name]: attackData
            }
        }
    };
    let spawned = await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, "celestial", {}, workflow.castData.castLevel);
    let weaponType = selectionWeapon.replace(/[0-9.]/g, "");
    let spawnedEffect = await mba.findEffect(spawned.actor, `${workflow.token.document.name} Spiritual Weapon`);
    if (!spawnedEffect) return;
    let spawnedUpdates = {
        "flags": {
            "mba-premades": {
                "spell": {
                    "spiritualWeapon": {
                        "weaponType": weaponType
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
    let weaponType = effect.flags["mba-premades"]?.spell?.spiritualWeapon?.weaponType;
    let attackAnimation;
    switch (weaponType) {
        case "club": attackAnimation = "jb2a.club.melee.01.white"; break;
        case "dagger": attackAnimation = "jb2a.dagger.melee.02.white"; break;
        case "falchion": attackAnimation = "jb2a.falchion.melee.01.white"; break;
        case "glaive": attackAnimation = "jb2a.glaive.melee.01.white"; break;
        case "greataxe": attackAnimation = "jb2a.greataxe.melee.standard.white"; break;
        case "greatsword": attackAnimation = "jb2a.greatsword.melee.standard.white"; break;
        case "greatclub": attackAnimation = "jb2a.melee_attack.03.greatclub.01"; break;
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
        case "wrench": attackAnimation = "jb2a.wrench.melee.01.white"; break;
    }

    new Sequence()

        .effect()
        .file(attackAnimation)
        .attachTo(token)
        .stretchTo(target)
        .mirrorY()
        .size(1.2)
        .missed(!workflow.hitTargets.size)

        .play()
}

export let spiritualWeapon = {
    "item": item,
    "attack": attack
}