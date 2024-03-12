export async function spiritualWeapon({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - Spiritual Weapon');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Spiritual Weapon)');
        return;
    }
    let name = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Spiritual Weapon';
    if (name === '') name = 'Spiritual Weapon';
    let damageFormula = workflow.castData.castLevel - 1;
    let attackData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Summon Features', 'Attack (Spiritual Weapon)', false);
    if (!attackData) return;
    attackData.system.damage.parts[0][0] += damageFormula + 'd8' + ' + ' + chrisPremades.helpers.getSpellMod(workflow.item) + '[force]';
    attackData.system.attackBonus = chrisPremades.helpers.getSpellMod(workflow.item) + workflow.actor.system.attributes.prof - 2;
    let updates = {
        'actor': {
            'name': name,
            'prototypeToken': {
                'name': name,
                'disposition': workflow.token.document.disposition
            }
        },
        'token': {
            'name': name,
            'disposition': workflow.token.document.disposition
        },
        'embedded': {
            'Item': {
                [attackData.name]: attackData
            }
        }
    };

    async function selectTokenImg () {
        let selectionStyle;
        let selectionWeapon;
        let selectionColor;
        let selectedImg = '';
        if (!chrisPremades.helpers.jb2aCheck()) {
            return;
        }
        if (chrisPremades.helpers.jb2aCheck() === 'patreon') {
            selectionStyle = await chrisPremades.helpers.dialog('What Style?', [
                ['Astral', 'astral.01'], 
                ['Dark', 'dark'], 
                ['Flaming', 'flaming'], 
                ['Liquid', 'liquid.01'], 
                ['Spectral', 'spectral']
            ]);
            if (!selectionStyle) return;
                if (selectionStyle === 'astral.01') {
                    selectionWeapon = await chrisPremades.helpers.dialog('What Weapon?', [
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
                    ]);
                    if (!selectionWeapon) return;
                    if (selectionWeapon === 'quarterstaff.01.') {
                        let staffSelection = await chrisPremades.helpers.dialog('What Type?', [
                            ['Metal Top', 'quarterstaff.01.'], 
                            ['Wood Top', 'quarterstaff.02.'], 
                            ['Orb Top', 'quarterstaff.03.'], 
                            ['Horned Top', 'quarterstaff.04.']
                        ]);
                        if (!staffSelection) return;
                        selectionWeapon = staffSelection;
                    }
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.blue'], 
                        ['Purple', '.purple']
                    ]);
                    if (!selectionColor) return;
                }
                if (selectionStyle === 'dark') {
                    selectionWeapon = await chrisPremades.helpers.dialog('What Weapon?', [
                        ['Longsword', 'longsword.01.'], 
                        ['Scythe', 'scythe.01.'], 
                        ['Sword', 'sword.']
                    ]);
                    if (!selectionWeapon) return;
                    if (selectionWeapon === 'longsword.01.') {
                        selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                            ['Blue', '.blue'],
                            ['Green', '.green'], 
                            ['Purple', '.purple'],
                            ['Red', '.red'],
                            ['White', '.white']
                        ]);
                        if (!selectionColor) return;
                    } else if (selectionWeapon === 'scythe.01.') {
                        selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                            ['Blue', '.blue'],
                            ['Green 1 (older)', '.green'],
                            ['Green 2 (newer)', '.green02'], 
                            ['Pink', '.pink'],
                            ['Purple', '.purple'],
                            ['Red', '.red'],
                            ['White', '.white']
                        ]);
                        if (!selectionColor) return;
                    } else if (selectionWeapon === 'sword.') {
                        selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                            ['Blue', '.blue'],
                            ['Green', '.green'], 
                            ['Purple', '.purple'],
                            ['Red', '.red'],
                            ['White', '.white']
                        ]);
                        if (!selectionColor) return;
                    }
                }
                if (selectionStyle === 'flaming') {
                    selectionWeapon = await chrisPremades.helpers.dialog('What Weapon?', [
                        ['Longsword', 'longsword.01.'], 
                        ['Mace', 'mace.01.'], 
                        ['Maul', 'maul.01.'], 
                        ['Sword', 'sword.']
                    ]);
                    if (!selectionWeapon) return;
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.blue'],
                        ['Green', '.green'], 
                        ['Orange', '.orange'],
                        ['Purple', '.purple'],
                        ['Red', '.red'],
                        ['Yellow', '.yellow']
                    ]);
                    if (!selectionColor) return;
                }
                if (selectionStyle === 'liquid.01') {
                    selectionWeapon = await chrisPremades.helpers.dialog('What Weapon?', [
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
                    ]);
                    if (!selectionWeapon) return;
                    if (selectionWeapon === 'quarterstaff.01.') {
                        let staffSelection = await chrisPremades.helpers.dialog('What Type?', [
                            ['Metal Top', 'quarterstaff.01.'], 
                            ['Wood Top', 'quarterstaff.02.'], 
                            ['Orb Top', 'quarterstaff.03.'], 
                            ['Horned Top', 'quarterstaff.04.']
                        ]);
                        if (!staffSelection) return;
                        selectionWeapon = staffSelection;
                    }
                    selectionColor = '.blue';
                }
                if (selectionStyle === 'spectral') {
                    selectionWeapon = await chrisPremades.helpers.dialog('What Weapon?', [
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
                ]);
                if (!selectionWeapon) return;
                if (selectionWeapon === 'longsword.01.') {
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.01.blue'],
                        ['Green 1 (older)', '.01.green'],
                        ['Green 2 (newer)', '.02.green'],
                        ['Orange', '.01.orange'],
                        ['Purple', '.01.purple'],
                        ['Red', '.01.red']
                    ]);
                    if (!selectionColor) return;
                } else if (selectionWeapon === 'mace.01.') {
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.01.blue'],
                        ['Green 1 (older)', '.01.green'],
                        ['Green 2 (newer)', '.02.green'],
                        ['Orange', '.01.orange'],
                        ['Purple', '.01.purple'],
                        ['Red', '.01.red']
                    ]);
                    if (!selectionColor) return;
                } else if (selectionWeapon === 'maul.01.') {
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.01.blue'],
                        ['Green 1 (older)', '.01.green'],
                        ['Green 2 (newer)', '.02.green'],
                        ['Orange', '.01.orange'],
                        ['Purple', '.01.purple'],
                        ['Red', '.01.red']
                    ]);
                    if (!selectionColor) return;
                } else if (selectionWeapon === 'quarterstaff.01.') {
                    let staffSelection = await chrisPremades.helpers.dialog('What Type?', [
                        ['Metal Top', 'quarterstaff.01.'], 
                        ['Wood Top', 'quarterstaff.02.'], 
                        ['Orb Top', 'quarterstaff.03.'], 
                        ['Horned Top', 'quarterstaff.04.']
                    ]);
                    if (!staffSelection) return;
                    selectionWeapon = staffSelection;
                    selectionColor = '.02.green';
                } else if (selectionWeapon === 'scythe.01.') {
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.01.blue'],
                        ['Green 1 (older)', '.01.green'],
                        ['Green 2 (newer)', '.02.green'],
                        ['Orange', '.01.orange'],
                        ['Purple', '.01.purple'],
                        ['Red', '.01.red'],
                        ['White', '.01.white']
                    ]);
                    if (!selectionColor) return;
                } else if (selectionWeapon === 'sword.') {
                    selectionColor = await chrisPremades.helpers.dialog('What Color?', [
                        ['Blue', '.blue'],
                        ['Green', '.green'],
                        ['Orange', '.orange'],
                        ['Purple', '.purple'],
                        ['Red', '.red']
                    ]);
                    if (!selectionColor) return;
                } else {
                    selectionColor = '.02.green';
                }
            }
            selectedImg = 'jb2a.spiritual_weapon.' + selectionWeapon + selectionStyle + selectionColor;
        }
        selectedImg = await Sequencer.Database.getEntry(selectedImg).file;
        return selectedImg;
    }

    let avatarImg = chrisPremades.helpers.getConfiguration(workflow.item, 'avatar');
    if (avatarImg) updates.actor.img = avatarImg;
    let tokenImg = chrisPremades.helpers.getConfiguration(workflow.item, 'token');
    if (!tokenImg) tokenImg = await selectTokenImg();
    if (tokenImg) {
        setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        setProperty(updates, 'token.texture.src', tokenImg);
    }
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'celestial';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, animation);
}