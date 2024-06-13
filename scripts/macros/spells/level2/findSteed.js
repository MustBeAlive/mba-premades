import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let folder = 'Find Steed';
    let actors = game.actors.filter(i => i.folder?.name === folder);
    if (actors.length < 1) {
        ui.notifications.warn('No actors found in steeds folder! (Default named "Find Steed")');
        return;
    }
    let sourceActor = await mba.selectDocument('Choose Steed:', actors);
    if (!sourceActor) return;
    let choicesType = [['Celestial', 'celestial'], ['Fey', 'fey'], ['Fiend', 'fiend']];
    let creatureType = await mba.dialog(`Find Steed: Type`, choicesType, "Choose steed type:");
    if (!creatureType) return;
    let languageOptions = (Array.from(workflow.actor.system.traits.languages.value).map(i => [i.charAt(0).toUpperCase() + i.slice(1), i]));
    if (!languageOptions) return;
    let languageSelected = new Set(await mba.dialog(`Find Steed: Language`, languageOptions, "Choose language:"));
    if (!languageSelected) return;
    let sourceActorIntelligence = sourceActor[0].system.abilities.int.value;
    if (sourceActorIntelligence < 6) sourceActorIntelligence = 6;
    let tokenName = `${workflow.token.document.name} Mage Hand`;
    let updates = {
        'actor': {
            'name': tokenName,
            'system': {
                'abilities': {
                    'int': {
                        'value': sourceActorIntelligence
                    }
                },
                'details': {
                    'type': {
                        'value': creatureType
                    }
                },
                'traits': {
                    'languages': languageSelected
                }
            },
            'prototypeToken': {
                'name': tokenName
            }
        },
        'token': {
            'name': tokenName,
            'disposition': workflow.token.document.disposition
        }
    };
    let updates2 = {
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'priority': 20,
                'value': 'function.mbaPremades.macros.findSteed.onUse,preambleComplete'
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'findSteed': true
                }
            }
        }
    };
    let defaultAnimations = {
        'celestial': 'celestial',
        'fey': 'nature',
        'fiend': 'fire'
    };
    let animation = defaultAnimations[creatureType];
    await summons.spawn(sourceActor, updates, 86400, workflow.item, workflow.token, workflow.item.system?.range?.value, { 'spawnAnimation': animation });
    let effect = mba.findEffect(workflow.actor, workflow.item.name);
    await mba.updateEffect(effect, updates2);
}

async function onUse({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != 'spell') return;
    if (workflow.targets.size != 1) return;
    if (workflow.targets.first().id != workflow.token.id) return;
    let effect = mba.getEffects(workflow.actor).find((e) => e.flags['mba-premades']?.spell?.findSteed === true);
    if (!effect) return;
    let steedId = effect.flags['mba-premades']?.summons?.ids[effect.name][0];
    if (!steedId) return;
    let steedToken = canvas.scene.tokens.get(steedId).object;
    if (!steedToken) return;
    if (mba.getDistance(workflow.token, steedToken) > 5) return;
    if (await mba.dialog('Find Steed', [['Yes', false], ['No', true]], 'Target Steed as well? (If mounted)')) return;
    let newTargets = [workflow.token.id, steedId];
    mba.updateTargets(newTargets);
}

export let findSteed = {
    'item': item,
    'onUse': onUse
}