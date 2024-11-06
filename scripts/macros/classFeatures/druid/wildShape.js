import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';

// To do: rework after PHB2024 release

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let circleForms = mba.getItem(workflow.actor, 'Circle Forms');
    let druidLevel = workflow.actor.classes.druid?.system?.levels;
    if (!druidLevel) return;
    let maxCR = 0;
    if (druidLevel >= 2 && druidLevel < 4) maxCR = 0.25;
    else if (druidLevel >= 4 && druidLevel < 8) maxCR = 0.5;
    else maxCR = 1;
    if (circleForms && druidLevel >= 6) maxCR = Math.floor(druidLevel / 3);
    else if (circleForms) maxCR = 1;
    let pack = game.packs.get("mba-premades.MBA Wild Shape");
    if (!pack) {
        ui.notifications.warn("Unable to find Wild Shape compenidum! (MBA Wild Shape)");
        return;
    }
    let index = await pack.getIndex({ 'fields': ['uuid', 'system.details.type.value', 'system.details.cr'] });
    if (!index.size) return;
    let documents = index.filter(i => i.system.details?.type?.value === 'beast' && i.system.details.cr <= maxCR);
    let elementalWildShape = mba.getItem(workflow.actor, 'Elemental Wild Shape');
    let elementals = [
        'Air Elemental',
        'Earth Elemental',
        'Fire Elemental',
        'Water Elemental'
    ];
    if (elementalWildShape && workflow.item.system.uses.value >= 2) documents = documents.concat(index.filter(i => elementals.includes(i.name)));
    await mba.playerDialogMessage(game.user);
    let selectedCreatures = await mba.selectDocument(workflow.item.name, documents, false, false, true, true);
    await mba.clearPlayerDialogMessage();
    if (!selectedCreatures) return;
    let selectedActor = await fromUuid(selectedCreatures[0].uuid);
    if (elementals.includes(selectedActor.name)) await workflow.item.update({ 'system.uses.value': workflow.item.system.uses.value - 1 });
    let equipedItems = workflow.actor.items.filter(i => i.system.equipped && i.type != 'container');
    let selection;
    if (equipedItems.length > 0) {
        let generatedInputs = [];
        for (let i of equipedItems) {
            generatedInputs.push({
                'label': i.name,
                'type': 'select',
                'options': ['Merge / Drop', 'Wear'],
                'value': i.uuid
            });
        }
        selection = await mba.menu("Wild Shape", constants.okCancel, generatedInputs, true, 'What happens to your equipment?');
        if (!selection) return;
    }
    let wildshapeActor = duplicate(selectedActor.toObject());
    delete wildshapeActor.token;
    delete wildshapeActor.items;
    delete wildshapeActor.effects;
    delete wildshapeActor.type;
    delete wildshapeActor.flags;
    delete wildshapeActor.folder;
    delete wildshapeActor.name;
    delete wildshapeActor.sort;
    delete wildshapeActor._id;
    delete wildshapeActor._stats;
    delete wildshapeActor.ownership;
    let texture = wildshapeActor.prototypeToken.texture;
    let wildshapeToken = {
        'name': `${selectedActor.name}`,
        'height': wildshapeActor.prototypeToken.height,
        'flags': {
            'autorotate': {
                    'enabled': wildshapeActor.prototypeToken.flags.autorotate?.enabled,
                    'offset': wildshapeActor.prototypeToken.flags.autorotate?.offset
            }
        },
        'texture': texture,
        'width': wildshapeActor.prototypeToken.width,
    };
    wildshapeActor.prototypeToken = wildshapeToken;
    wildshapeActor.system.abilities.cha = workflow.actor.system.abilities.cha;
    wildshapeActor.system.abilities.int = workflow.actor.system.abilities.int;
    wildshapeActor.system.abilities.wis = workflow.actor.system.abilities.wis;
    wildshapeActor.system.attributes.prof = workflow.actor.system.attributes.prof;
    delete wildshapeActor.system.attributes.attunement;
    delete wildshapeActor.system.attributes.death;
    delete wildshapeActor.system.attributes.encumbrance;
    delete wildshapeActor.system.attributes.exhuastion;
    delete wildshapeActor.system.attributes.hd;
    delete wildshapeActor.system.attributes.init;
    delete wildshapeActor.system.attributes.inspiration;
    delete wildshapeActor.system.attributes.spellcasting;
    delete wildshapeActor.system.attributes.spelldc;
    delete wildshapeActor.system.bonuses;
    delete wildshapeActor.system.currency;
    delete wildshapeActor.system.details;
    delete wildshapeActor.system.resources;
    delete wildshapeActor.system.scale;
    let sourceSkills = workflow.actor.system.skills;
    let targetSkills = selectedActor.system.skills;
    let skills = {};
    for (let i of Object.keys(sourceSkills)) {
        if (targetSkills[i].proficient > sourceSkills[i].proficient) skills[i] = { 'value': targetSkills[i].proficient };
    }
    wildshapeActor.system.skills = skills;
    delete wildshapeActor.system.tools;
    wildshapeActor.system.traits = {
        'size': selectedActor.system.traits.size
    };
    delete wildshapeActor.system.spells;
    let mutateOptions = {
        'name': 'Wild Shape',
        'comparisonKeys': {
            'Item': 'id'
        }
    };
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Wild Shape', { 'updateOpts': { 'actor': { 'noConcentrationCheck': true } } });
        await warpgate.wait(500);
        if (mbaPremades.helpers.findEffect(actor, "Prone")) await mbaPremades.helpers.removeCondition(actor, "Prone");
        let excessEffect = await mbaPremades.helpers.findEffect(actor, "Wild Shape: Excess Damage");
        if (!excessEffect) return;
        let excessDamage = excessEffect.flags['mba-premades']?.feature?.wildShape?.excessDamage;
        await mbaPremades.helpers.applyDamage([token], excessDamage, "none");
        await mbaPremades.helpers.removeEffect(excessEffect);
    }
    let druidLevels = workflow.actor.classes.druid?.system?.levels;
    if (!druidLevels) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Class Feature Items", "Wild Shape: Revert", false);
    if (!featureData) return;
    let changes = [
        {
            'key': 'flags.midi-qol.fail.spell.vocal',
            'value': '1',
            'mode': 0,
            'priority': 20
        },
        {
            'key': 'flags.midi-qol.fail.spell.somatic',
            'value': '1',
            'mode': 0,
            'priority': 20
        },
        {
            'key': 'flags.midi-qol.fail.spell.material',
            'value': '1',
            'mode': 0,
            'priority': 20
        },
        {
            'key': 'flags.midi-qol.onUseMacroName',
            'mode': 0,
            'value': 'function.mbaPremades.macros.wildShape.hook,preTargetDamageApplication',
            'priority': 20
        }
    ];
    if (druidLevels >= 18) changes = [
        {
            'key': 'flags.midi-qol.fail.spell.material',
            'value': '1',
            'mode': 0,
            'priority': 20
        },
        {
            'key': 'flags.midi-qol.onUseMacroName',
            'mode': 0,
            'value': 'function.mbaPremades.macros.wildShape.hook,preTargetDamageApplication',
            'priority': 20
        }
    ];
    else if (druidLevels === 20) changes = [
        {
            'key': 'flags.midi-qol.onUseMacroName',
            'mode': 0,
            'value': 'function.mbaPremades.macros.wildShape.hook,preTargetDamageApplication',
            'priority': 20
        }
    ];
    let effectData = {
        'name': 'Wild Shape',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': Math.min(druidLevels / 2) * 3600
        },
        'changes': changes,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
        }
    };
    let invalidTypes = [
        'weapon',
        'equipment',
        'consumable',
        'tool',
        'container',
        'loot',
        'backpack'
    ];
    let items = workflow.actor.items.filter(i => invalidTypes.includes(i.type) && !i.system.equipped && i.type != 'container');
    let itemUpdates = {};
    for (let i of items) itemUpdates[i.id] = warpgate.CONST.DELETE;
    if (selection) {
        for (let i = 0; selection.inputs.length > i; i++) {
            if (selection.inputs[i] === 'Merge / Drop') {
                itemUpdates[equipedItems[i].id] = warpgate.CONST.DELETE;
            }
        }
    }
    let primalStrike = mba.getItem(workflow.actor, "Primal Strike");
    let insigniaOfClaws = mba.getItem(workflow.actor, "Insignia of Claws");
    let targetItems = selectedActor.items.contents;
    for (let i of targetItems) {
        itemUpdates[i.id] = i.toObject();
        if (primalStrike && itemUpdates[i.id].type === 'weapon') {
            itemUpdates[i.id].system.properties.push('mgc');
        }
        if (insigniaOfClaws && itemUpdates[i.id].type === 'weapon') {
            try {
                itemUpdates[i.id].system.damage.parts[0][0] += ' + 1';
            } catch (error) { /* empty */ }
            itemUpdates[i.id].system.attack.bonus = 1;
        }
        itemUpdates[i.id].flags['tidy5e-sheet'] = { 'favorite': true };
        if (invalidTypes.includes(itemUpdates[i.id].type)) continue;
        itemUpdates[i.id].flags['custom-character-sheet-sections'] = { 'sectionName': 'Wild Shape' };
    }
    itemUpdates[featureData._id] = featureData;
    let updates = {
        'token': wildshapeToken,
        'actor': wildshapeActor,
        'embedded': {
            'Item': itemUpdates,
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    if (mba.findEffect(workflow.actor, "Concentrating")) await mba.createEffect(workflow.actor, constants.immunityEffectData); //cringe
    await warpgate.mutate(workflow.token.document, updates, {}, mutateOptions);
}

async function hook({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.damageItem.newHP != 0) return;
    let tokenDoc = await fromUuid(workflow.damageItem.tokenUuid);
    let effect = mba.findEffect(tokenDoc.actor, 'Wild Shape');
    if (!effect) {
        ui.notifications.warn("Unable to find Wild Shape effect!");
        return;
    }
    let excessDamage = workflow.damageItem.totalDamage - workflow.damageItem.oldHP;
    if (excessDamage < 1) {
        await mba.removeEffect(effect);
        return;
    }
    let effectData = {
        'name': "Wild Shape: Excess Damage",
        'flags': {
            'mba-premades': {
                'feature': {
                    'wildShape': {
                        'excessDamage': excessDamage
                    }
                }
            }
        }
    };
    await mba.createEffect(tokenDoc.actor, effectData);
    await mba.removeEffect(effect);
}

async function revert({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, 'Wild Shape');
    if (effect) await mba.removeEffect(effect);
}

export let wildShape = {
    'item': item,
    'hook': hook,
    'revert': revert
};