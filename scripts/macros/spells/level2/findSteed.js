import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Find Steed");
    if (oldEffect) await mba.removeEffect(oldEffect);
    let folder = 'Find Steed';
    let actors = game.actors.filter(i => i.folder?.name === folder);
    if (actors.length < 1) {
        ui.notifications.warn('No actors found in steeds folder! (Default named "Find Steed")');
        return;
    }
    await mba.clearPlayerDialogMessage();
    let sourceActor = await mba.selectDocument('Choose Steed:', actors);
    await mba.clearPlayerDialogMessage();
    if (!sourceActor) return;
    let choicesType = [['Celestial', 'celestial'], ['Fey', 'fey'], ['Fiend', 'fiend']];
    await mba.playerDialogMessage();
    let creatureType = await mba.dialog(`Find Steed: Type`, choicesType, "Choose steed type:");
    await mba.clearPlayerDialogMessage();
    if (!creatureType) return;
    let languageOptions = (Array.from(workflow.actor.system.traits.languages.value).map(i => [i.charAt(0).toUpperCase() + i.slice(1), i]));
    if (!languageOptions) {
        ui.notifications.warn("Caster doesn't know any languages!");
        return;
    }
    await mba.playerDialogMessage();
    let languageSelected = new Set(await mba.dialog(`Find Steed: Language`, languageOptions, "Choose language:"));
    await mba.clearPlayerDialogMessage();
    if (!languageSelected) return;
    let sourceActorIntelligence = sourceActor[0].system.abilities.int.value;
    if (sourceActorIntelligence < 6) sourceActorIntelligence = 6;
    let tokenName = `${workflow.token.document.name} Steed`;
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
    await summons.spawn(sourceActor, updates, 864000, workflow.item, undefined, undefined, 30, workflow.token, animation);
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