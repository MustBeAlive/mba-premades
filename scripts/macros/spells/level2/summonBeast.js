import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName('MBA: Bestial Spirit');
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Bestial Spirit)");
        return;
    }
    let choices = [
        ["Air", "Air", "modules/mba-premades/icons/spells/level2/summon_beast/spirit_air.webp"],
        ["Land", "Land", "modules/mba-premades/icons/spells/level2/summon_beast/spirit_land.webp"],
        ["Water", "Water", "modules/mba-premades/icons/spells/level2/summon_beast/spirit_water.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage('Summon Beast', choices, "<b>Choose type:</b>", "both");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let avatarImg = selection[1];
    let multiAttackFeatureData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Bestial Spirit: Multiattack', false);
    if (!multiAttackFeatureData) {
        ui.notifications.warn("Unable to find item in the compendium!! (Bestial Spirit: Multiattack)");
        return;
    }
    let attacks = Math.floor(workflow.castData.castLevel / 2);
    multiAttackFeatureData.name = `Multiattack (${attacks} Attacks)`;
    let maulData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Bestial Spirit: Maul', false);
    if (!maulData) {
        ui.notifications.warn("Unable to find item in the compendium!! (Bestial Spirit: Maul)");
        return;
    }
    let castMod = await mba.getSpellMod(workflow.item);
    maulData.system.attackBonus = -4 + castMod;
    maulData.system.damage.parts[0][0] += ' + ' + workflow.castData.castLevel;
    let hpFormula;
    let name = `${workflow.token.document.name} Bestial Spirit`;
    let updates = {
        'actor': {
            'img': avatarImg,
            'name': name,
            'system': {
                'details': {
                    'cr': tashaSummon.getCR(workflow.actor.system.attributes.prof)
                },
                'attributes': {
                    'ac': {
                        'flat': 11 + workflow.castData.castLevel
                    }
                }
            },
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
                'name': name,
                'texture': {
                    'src': avatarImg
                }
            },
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': name,
            'texture': {
                'src': avatarImg
            }
        },
        'embedded': {
            'Item': {
                [multiAttackFeatureData.name]: multiAttackFeatureData,
                [maulData.name]: maulData
            }
        }
    };
    switch (selection[0]) {
        case 'Air':
            let flybyData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Bestial Spirit: Flyby', false);
            if (!flybyData) {
                ui.notifications.warn("Unable to find item in the compendium!! (Bestial Spirit: Flyby)");
                return;
            }
            updates.embedded.Item[flybyData.name] = flybyData;
            updates.actor.system.attributes.movement = {
                'walk': 30,
                'fly': 60
            };
            hpFormula = 20 + ((workflow.castData.castLevel - 2) * 5);
            updates.actor.system.attributes.hp = {
                'formula': hpFormula,
                'max': hpFormula,
                'value': hpFormula
            };
            break;
        case 'Land':
            let packTacticsData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Bestial Spirit: Pack Tactics', false);
            if (!packTacticsData) {
                ui.notifications.warn("Unable to find item in the compendium!! (Bestial Spirit: Pack Tactics)");
                return;
            }
            updates.embedded.Item[packTacticsData.name] = packTacticsData;
            updates.actor.system.attributes.movement = {
                'walk': 30,
                'climb': 30
            };
            hpFormula = 30 + ((workflow.castData.castLevel - 2) * 5);
            updates.actor.system.attributes.hp = {
                'formula': hpFormula,
                'max': hpFormula,
                'value': hpFormula
            };
            break;
        case 'Water':
            let packTacticsData2 = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Bestial Spirit: Pack Tactics', false);
            if (!packTacticsData2) {
                ui.notifications.warn("Unable to find item in the compendium!! (Bestial Spirit: Pack Tactics)");
                return;
            }
            updates.embedded.Item[packTacticsData2.name] = packTacticsData2;
            updates.actor.system.attributes.movement = {
                'walk': 30,
                'swim': 30
            };
            hpFormula = 30 + ((workflow.castData.castLevel - 2) * 5);
            updates.actor.system.attributes.hp = {
                'formula': hpFormula,
                'max': hpFormula,
                'value': hpFormula
            };
            break;
    }
    let defaultAnimations = {
        'Air': 'air',
        'Land': 'earth',
        'Water': 'water'
    };
    let animation = defaultAnimations[selection[0]];
    await mba.playerDialogMessage(game.user);
    await tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 90, workflow.token, animation, {}, workflow.castData.castLevel);
    await mba.clearPlayerDialogMessage();
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.claws.400px.bright_green")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .missed(!workflow.hitTargets.size)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .delay(200)
        .attachTo(target)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .duration(2500)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

export let summonBeast = {
    'item': item,
    'attack': attack
}