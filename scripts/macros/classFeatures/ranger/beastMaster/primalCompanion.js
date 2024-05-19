import {mba} from '../../../../helperFunctions.js';
import {queue} from '../../../mechanics/queue.js';
import {tashaSummon} from '../../../generic/tashaSummon.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let selection = await mba.dialog(workflow.item.name, [['Land', 'Land'], ['Sea', 'Sea'], ['Sky', 'Sky']], "<b>Choose companion type:</b>");
    if (!selection) return;
    let sourceActor = game.actors.getName('MBA: Primal Companion');
    if (!sourceActor) return;
    let rangerLevel = workflow.actor.classes?.ranger?.system?.levels;
    if (!rangerLevel) return;
    let primalBondData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Primal Bond', false);
    if (!primalBondData) {
        ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Primal Bond)");
        return;
    }
    let commandData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Primal Companion: Command', false);
    if (!commandData) {
        ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Command)");
        return;
    }
    let dodgeData = await mba.getItemFromCompendium('mba-premades.MBA Actions', 'Dodge', false);
    if (!dodgeData) {
        ui.notifications.warn("Unable to find item in the compendium! (Dodge)");
        return;
    }
    let hpFormula = 5 + (rangerLevel * 5);
    let name = `Beast of the ${selection}`;
    let meleeAttackBonus = await new Roll(workflow.actor.system.bonuses.msak.attack + ' + 0', workflow.actor.getRollData()).roll({ 'async': true });
    let rangedAttackBonus = await new Roll(workflow.actor.system.bonuses.rsak.attack + ' + 0', workflow.actor.getRollData()).roll({ 'async': true });
    let updates = {
        'actor': {
            'name': name,
            'system': {
                'details': {
                    'cr': tashaSummon.getCR(workflow.actor.system.attributes.prof)
                },
                'attributes': {
                    'hp': {
                        'formula': hpFormula,
                        'max': hpFormula,
                        'value': hpFormula
                    },
                    'ac': {
                        'flat': 14 + workflow.actor.system.attributes.prof
                    }
                },
                'traits': {
                    'languages': workflow.actor.system?.traits?.languages
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
                            'melee': mba.getSpellMod(workflow.item) - sourceActor.system.abilities.wis.mod + meleeAttackBonus.total,
                            'ranged': mba.getSpellMod(workflow.item) - sourceActor.system.abilities.wis.mod + rangedAttackBonus.total
                        }
                    }
                }
            }
        },
        'embedded': {
            'Item': {
                [primalBondData.name]: primalBondData,
                [dodgeData.name]: dodgeData
            }
        },
        'token': {
            'name': name,
            'disposition': workflow.token.document.disposition
        }
    }
    let updates2 = {};
    switch (selection) {
        case 'Land':
            let chargeData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Charge', false);
            if (!chargeData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Charge)");
                return;
            }
            chargeData.system.save.dc = mba.getSpellDC(workflow.item);
            let maulData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Maul', false);
            if (!maulData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Maul)");
                return;
            }
            updates2 = {
                'actor': {
                    'system': {
                        'attributes': {
                            'movement': {
                                'walk': '40',
                                'climb': '40'
                            }
                        }
                    }
                },
                'embedded': {
                    'Item': {
                        [chargeData.name]: chargeData,
                        [maulData.name]: maulData
                    }
                }
            }
            if (rangerLevel >= 7) {
                updates2.embedded.Item[chargeData.name].flags.midiProperties.magicdam = true,
                    updates2.embedded.Item[maulData.name].flags.midiProperties.magicdam = true
            }
            break;
        case 'Sea':
            let amphibiousData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Amphibious', false);
            if (!amphibiousData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Amphibious)");
                return;
            }
            let bindingStrikeData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Binding Strike', false);
            if (!bindingStrikeData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Binding Strike)");
                return;
            }
            updates2 = {
                'actor': {
                    'system': {
                        'attributes': {
                            'movement': {
                                'walk': '5',
                                'swim': '60'
                            }
                        }
                    }
                },
                'embedded': {
                    'Item': {
                        [amphibiousData.name]: amphibiousData,
                        [bindingStrikeData.name]: bindingStrikeData
                    }
                }
            };
            if (rangerLevel >= 7) {
                updates2.embedded.Item[bindingStrikeData.name].flags.midiProperties.magicdam = true
            }
            break;
        case 'Sky':
            hpFormula = 4 + 4 * rangerLevel;
            let flybyData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Flyby', false);
            if (!flybyData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Flyby)");
                return;
            }
            let shredData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Primal Companion: Shred', false);
            if (!shredData) {
                ui.notifications.warn("Unable to find item in the compendium! (Primal Companion: Shred)");
                return;
            }
            updates2 = {
                'actor': {
                    'system': {
                        'abilities': {
                            'str': {
                                'value': 6
                            },
                            'dex': {
                                'value': 16
                            },
                            'con': {
                                'value': 13
                            }
                        },
                        'attributes': {
                            'hp': {
                                'formula': hpFormula,
                                'max': hpFormula,
                                'value': hpFormula
                            },
                            'movement': {
                                'walk': '10',
                                'fly': '60'
                            }
                        },
                        'traits': {
                            'size': 'sm'
                        }
                    }
                },
                'token': {
                    'texture': {
                        'scaleX': 0.8,
                        'scaleY': 0.8
                    }
                },
                'embedded': {
                    'Item': {
                        [flybyData.name]: flybyData,
                        [shredData.name]: shredData
                    }
                }
            };
            if (rangerLevel >= 7) {
                updates2.embedded.Item[shredData.name].flags.midiProperties.magicdam = true
            }
            break;
    }
    /*
    let avatarImg = mba.getConfiguration(workflow.item, 'avatar-' + selection);
    let tokenImg = mba.getConfiguration(workflow.item, 'token-' + selection);
    if (avatarImg) updates.actor.img = avatarImg;
    if (tokenImg) {
        setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        setProperty(updates, 'token.texture.src', tokenImg);
    }
    */
    updates = mergeObject(updates, updates2, { 'recursive': true });
    let defaultAnimations = {
        'Sky': 'air',
        'Land': 'earth',
        'Sea': 'water'
    };
    let animation = defaultAnimations[selection];
    await tashaSummon.spawn(sourceActor, updates, 86400, workflow.item, 30, workflow.token, animation);
    let updates3 = {
        'embedded': {
            'Item': {
                [commandData.name]: commandData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Primal Companion',
        'description': commandData.name
    };
    await warpgate.mutate(workflow.token.document, updates3, {}, options);
    let effect = mba.findEffect(workflow.actor, workflow.item.name);
    if (!effect) return;
    let currentScript = effect.flags.effectmacro?.onDelete?.script;
    if (!currentScript) return;
    let effectUpdates = {
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': currentScript + ' await warpgate.revert(token.document, "Primal Companion");'
                }
            }
        }
    };
    await mba.updateEffect(effect, effectUpdates);
}

async function bindingStrike({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'bindingStrike', 50);
    if (!queueSetup) return;
    let selection = await mba.dialog('Blinding Strike', [['Piercing', 'piercing'], ['Bludgeoning', 'bludgeoning']], "<b>Choose damage type:</b>");
    if (!selection) selection = 'piercing';
    let damageFormula = workflow.damageRoll._formula.replace('none', selection);
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let primalCompanion = {
    'item': item,
    'bindingStrike': bindingStrike,
}