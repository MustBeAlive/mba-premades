import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let selection = await mba.dialog('Summon Beast', [['Air', 'Air'], ['Land', 'Land'], ['Water', 'Water']], "<b>Choose type:</b>");
    if (!selection) return;
    let sourceActor = game.actors.getName('MBA: Bestial Spirit');
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Bestial Spirit)");
        return;
    }
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
    maulData.system.damage.parts[0][0] += ' + ' + workflow.castData.castLevel;
    let hpFormula;
    let name = `${workflow.token.document.name} Bestial Spirit`;
    let meleeAttackBonus = await new Roll(workflow.actor.system.bonuses.msak.attack + ' + 0', workflow.actor.getRollData()).roll({ 'async': true });
    let rangedAttackBonus = await new Roll(workflow.actor.system.bonuses.rsak.attack + ' + 0', workflow.actor.getRollData()).roll({ 'async': true });
    console.log(meleeAttackBonus.total);
    console.log(rangedAttackBonus.total);
    let updates = {
        'actor': {
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
                'name': name,
                'disposition': workflow.token.document.disposition
            },
            'flags': {
                'mba-premades': {
                    'summon': {
                        'attackBonus': {
                            'melee': mba.getSpellMod(workflow.item) - sourceActor.system.abilities.str.mod + meleeAttackBonus.total,
                            'ranged': mba.getSpellMod(workflow.item) - sourceActor.system.abilities.str.mod + rangedAttackBonus.total
                        }
                    }
                }
            }
        },
        'token': {
            'name': name,
            'disposition': workflow.token.document.disposition
        },
        'embedded': {
            'Item': {
                [multiAttackFeatureData.name]: multiAttackFeatureData,
                [maulData.name]: maulData
            }
        }
    };
    /*
    let avatarImg = mba.getConfiguration(workflow.item, 'avatar-' + selection);
    let tokenImg = mba.getConfiguration(workflow.item, 'token-' + selection);
    if (avatarImg) updates.actor.img = avatarImg;
    if (tokenImg) {
        setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        setProperty(updates, 'token.texture.src', tokenImg);
    }*/
    switch (selection) {
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
    let animation = defaultAnimations[selection];
    await tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 90, workflow.token, animation, {}, workflow.castData.castLevel);
}

async function packTactics({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let nearbyTargets = mba.findNearby(workflow.targets.first(), 5, 'enemy', false).filter(i => i.document.uuid != workflow.token.document.uuid);
    if (!nearbyTargets.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'packTactics', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Pack Tactics");
    queue.remove(workflow.item.uuid);
}

export let summonBeast = {
    'item': item,
    'packTactics': packTactics
}