import {mba} from '../../../helperFunctions.js';
import {summons} from '../../generic/summons.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let folder = "Find Familiar";
    let actors = game.actors.filter(i => i.folder?.name === folder);
    if (actors.length < 1) {
        ui.notifications.warn(`No actors found in familiars folder! (MBA Summons/Find Familiar)`);
        return;
    }
    let sourceActor = await mba.selectDocument('Choose Familiar', actors);
    if (!sourceActor) return;
    let creatureType = await mba.dialog('Choose creature type:', [['Celestial', 'celestial'], ['Fey', 'fey'], ['Fiend', 'fiend']]);
    if (!creatureType) return;
    let name = `${workflow.token.document.name} ${sourceActor[0].prototypeToken.name}`;
    let updates = {
        'actor': {
            'name': name,
            'system': {
                'details': {
                    'type': {
                        'value': creatureType
                    }
                }
            },
            'prototypeToken': {
                'name': name
            }
        },
        'token': {
            'name': name,
            'disposition': workflow.token.document.disposition
        }
    };
    let attackData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Find Familiar: Attack', false);
    if (!attackData) {
        ui.notifications.warn("Unable to find item in the compendium (Find Familiar: Attack)");
        return;
    }
    let updates2 = {
        'embedded': {
            'Item': {
                [attackData.name]: attackData
            }
        }
    };
    let updates3 = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'findFamiliar': true
                }
            }
        }
    };
    let investmentOfTheChainMaster = mba.getItem(workflow.actor, 'Eldritch Invocations: Investment of the Chain Master');
    if (investmentOfTheChainMaster) {
        let movement = await mba.dialog(investmentOfTheChainMaster.name, [['Flying', 'fly'], ['Swimming', 'swim']], 'Choose speed type to grant:s');
        let weaponItems = sourceActor[0].items.filter(i => i.type === 'weapon');
        let saveItems = sourceActor[0].items.filter(i => i.system.save.dc != null);
        for (let i of weaponItems) {
            let properties = Array.from(i.system.properties);
            properties.push('mgc');
            setProperty(updates, 'embedded.Item.' + i.name + '.system.properties', properties);
        }
        let saveDC = mba.getSpellDC(workflow.item);
        for (let i of saveItems) {
            setProperty(updates, 'embedded.Item.' + i.name + '.system.save.dc', saveDC);
        }
        setProperty(updates, 'actor.system.attributes.movement.' + movement, 40);
        let commandData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Investment of the Chain Master: Command', false);
        if (!commandData) return;
        let resistanceData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Investment of the Chain Master: Familiar Resistance', false);
        if (!resistanceData) return;
        setProperty(updates, 'embedded.Item.Investment of the Chain Master: Familiar Resistance', resistanceData);
        setProperty(updates2, 'embedded.Item.Investment of the Chain Master: Command', commandData);
        setProperty(updates3, 'flags.effectmacro.onTurnStart.script', 'mbaPremades.macros.investmentOfTheChainMaster.turnStart(effect)');
    }
    let options = {
        'permanent': false,
        'name': 'Find Familiar',
        'description': 'Find Familiar'
    };
    await warpgate.mutate(workflow.token.document, updates2, {}, options);
    let defaultAnimations = {
        'celestial': 'celestial',
        'fey': 'nature',
        'fiend': 'fire'
    };
    let animation = defaultAnimations[creatureType];
    await summons.spawn(sourceActor, updates, 86400, workflow.item, undefined, undefined, 10, workflow.token, animation, {}, workflow.castData.castLevel);
    let effect = mba.findEffect(workflow.actor, workflow.item.name);
    setProperty(updates3, 'flags.effectmacro.onDelete.script', effect.flags.effectmacro?.onDelete?.script + '; await warpgate.revert(token.document, "Find Familiar");');
    await mba.updateEffect(effect, updates3);
}

async function attackApply({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.getEffects(workflow.actor).find((e) => e?.flags['mba-premades']?.spell?.findFamiliar);
    if (!effect) return;
    let familiarId = effect.flags['mba-premades']?.summons?.ids[effect.name][0];
    if (!familiarId) return;
    let familiarToken = canvas.scene.tokens.get(familiarId);
    if (!familiarToken) {
        ui.notifications.warn("Unable to find familiar token on the scene");
        return;
    }
    if (mba.getDistance(workflow.token, familiarToken) > 100) {
        ui.notifications.info('Familiar is too far away!');
        return;
    }
    let effectData = {
        'name': 'Find Familiar: Attack',
        'icon': workflow.item.img,
        'origin': effect.origin.uuid,
        'duration': {
            'seconds': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.rangeOverride.attack.all',
                'mode': 0,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'priority': 20,
                'value': 'function.mbaPremades.macros.findFamiliar.attackEarly,preambleComplete'
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["1Attack", "1Spell"]
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    await mba.createEffect(familiarToken.actor, effectData);
}

async function attackEarly({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != 'spell' || workflow.item.system.range.units != 'touch') {
        ui.notifications.info('Invalid spell type!');
        return false;
    }
    let effect = mba.getEffects(workflow.actor).find((e) => e.flags['mba-premades']?.spell?.findFamiliar);
    if (!effect) return;
    let familiarId = effect.flags['mba-premades']?.summons?.ids[effect.name][0];
    if (!familiarId) return;
    let familiarToken = canvas.scene.tokens.get(familiarId);
    if (!familiarToken) return;
    if (mba.findEffect(familiarToken.actor, "Reaction")) {
        ui.notifications.warn("Your familiar doesn't have reaction to spend!");
        return false;
    }
    await mba.addCondition(familiarToken.actor, 'Reaction');
    let familiarEffect = await mba.findEffect(familiarToken.actor, "Find Familiar: Attack");
    if (familiarEffect) await mba.removeEffect(familiarEffect);
}

export let findFamiliar = {
    'item': item,
    'attackApply': attackApply,
    'attackEarly': attackEarly
};