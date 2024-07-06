import {mba} from "../../../../helperFunctions.js";

export async function hexWarrior({ speaker, actor, token, character, item, args, scope, workflow }) {
    let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && !i.system.properties?.two && i.system.equipped);
    if (!weapons.length) {
        ui.notifications.info('No valid equipped weapons to pick!');
        return;
    }
    let selection;
    if (weapons.length === 1) selection = weapons[0];
    else[selection] = await mba.selectDocument('Hex Warrior: Select Weapon:', weapons);
    if (!selection) return;
    let weaponData = duplicate(selection.toObject());
    let dex = workflow.actor.system.abilities.dex.mod;
    let cha = workflow.actor.system.abilities.cha.mod;
    let ability = weaponData.system.ability === null ? 'str' : weaponData.system.ability;
    let score = workflow.actor.system.abilities[ability].mod;
    let changed = false;
    if (weaponData.system.properties.fin) {
        let mod = dex > score ? dex : score;
        if (mod <= cha) {
            ability = 'cha';
            changed = true;
        }
    } else {
        if (score <= cha) {
            ability = 'cha';
            changed = true;
        }
    }
    if (changed) weaponData.system.ability = ability;
    async function effectMacroLongRest() {
        await warpgate.revert(token.document, 'Hex Warrior');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Weapon: <b>${selection.name}</b></p>
        `,
        'flags': {
            'dae': {
                'specialDuration': ['longRest']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroLongRest)
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [weaponData.name]: weaponData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Hex Warrior',
        'description': 'Hex Warrior'
    };

    new Sequence()

        .effect()
        .file("jb2a.particles.inward.purple.01.03")
        .attachTo(workflow.token)
        .scaleToObject(1.2)
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(2000)

        .effect()
        .file("jb2a.dodecahedron.skull.below.dark_greenpurple")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(2000)
        .belowTokens()

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}