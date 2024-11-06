import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function animation(token) {
    new Sequence()

        .effect()
        .file("jb2a.dodecahedron.rune.below.blueyellow")
        .attachTo(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { hue: 210 })

        .effect()
        .file("jb2a.particle_burst.01.rune.bluepurple")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .delay(2000)
        .fadeIn(1000)
        .playbackRate(0.9)

        .play()

    await warpgate.wait(4000);
}

async function carefulSpellItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < 1) {
        ui.notifications.info("Not enough sorcery points!");
        return;
    }
    const effectData = {
        'name': "Metamagic: Careful Spell",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Next time you cast a spell that forces other creatures to make a saving throw, you will be able to protect up to <b>${workflow.actor.system.abilities.cha.mod}</b> creatures from the spell's full force.</p>
            <p>A chosen creature automatically succeeds on its saving throw against the spell.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.metamagic.carefulSpellTrigger,preSave',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Spell']
            }
        }
    };
    await animation(workflow.token);
    await mba.createEffect(workflow.actor, effectData);
    await pointsItem.update({ "system.uses.value": points -= 1 });
}

async function carefulSpellTrigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size === 0 || workflow.item.type != "spell" || !workflow.hasSave) return;
    let max = workflow.actor.system.abilities.cha.mod;
    if (!max) return;
    let targets = Array.from(workflow.targets);
    let chosenTargets = [];
    for (let target of targets) {
        if (target.document.disposition === workflow.token.document.disposition) chosenTargets.push(target);
    }
    if (chosenTargets.length > max) {
        await mba.playerDialogMessage(game.user);
        let selection = await mba.selectTarget(`Metamagic: Careful Spell`, constants.okCancel, chosenTargets, true, 'multiple', undefined, false, `Select targets: (Max: ${max})`);
        await mba.clearPlayerDialogMessage();
        if (!selection.buttons) {
            ui.notifications.warn("Failed to select targets!");
            return;
        }
        chosenTargets = [];
        for (let i of selection.inputs) {
            if (i) chosenTargets.push(await fromUuid(i));
        }
        if (chosenTargets.length > max) {
            ui.notifications.warn("Too many targets selected, returning");
            return;
        }
    }
    for (let target of chosenTargets) await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function subtleSpellItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < 1) {
        ui.notifications.info("Not enough sorcery points!");
        return;
    }
    const effectData = {
        'name': "Metamagic: Subtle Spell",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Next spell you cast will not require neither somatic nor verbal components.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.fail.spell.somatic',
                'mode': 5,
                'value': 0,
                'priority': 120
            },
            {
                'key': 'flags.midi-qol.fail.spell.vocal',
                'mode': 5,
                'value': 0,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Spell']
            }
        }
    };
    await animation(workflow.token);
    await mba.createEffect(workflow.actor, effectData);
    await pointsItem.update({ "system.uses.value": points -= 1 });
}

async function quickenedSpellItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < 2) {
        ui.notifications.info("Not enough sorcery points!");
        return;
    }
    const effectData = {
        'name': "Metamagic: Quickened Spell",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Next spell you cast with a casting time of 1 action will have casting time of 1 bonus action.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.metamagic.quickenedSpellTrigger,preItemRoll',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Spell']
            }
        }
    };
    await animation(workflow.token);
    await mba.createEffect(workflow.actor, effectData);
    await pointsItem.update({ "system.uses.value": points -= 2 });
}

async function quickenedSpellTrigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != "spell" || workflow.item.system.activation.type != "action") return;
}

async function transmutedSpellItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < 1) {
        ui.notifications.info("Not enough sorcery points!");
        return;
    }
    const effectData = {
        'name': "Metamagic: Transmuted Spell",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You can change the damage type of the next spell you cast to one of the following damage types: acid, cold, fire, lightning, poison, thunder.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.metamagic.transmutedSpellTrigger,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Spell']
            }
        }
    };
    await animation(workflow.token);
    await mba.createEffect(workflow.actor, effectData);
    await pointsItem.update({ "system.uses.value": points -= 1 });
}

// To do: find a way to trigger for spells w/ synth items (scorching ray)
async function transmutedSpellTrigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    if (workflow.item.type != 'spell') return;
    let values = ["acid", "cold", "fire", "lightning", "poison", "thunder"];
    let queueSetup = await queue.setup(workflow.item.uuid, "transmutedSpell", 50);
    if (!queueSetup) return;
    let oldDamageRoll = workflow.damageRoll;
    let oldFlavor = [];
    for (let i of oldDamageRoll.terms) {
        if (values.includes(i.flavor.toLowerCase()) && i.isDeterministic === false) oldFlavor.push(i.flavor);
    }
    function valuesToOptions(arr) {
        let optionsPush = [];
        for (let i = 0; arr.length > i; i++) {
            if (typeof arr[i] != 'string') return;
            optionsPush.push([arr[i].charAt(0).toUpperCase() + arr[i].slice(1), arr[i]]);
        }
        return optionsPush;
    }
    let optionsOriginal = valuesToOptions(oldFlavor);
    let selectionOriginal = await mba.dialog("Metamagic: Transmute Spell", optionsOriginal, "Change what damage type?");
    if (!selectionOriginal) return;
    let options = [];
    for (let i of values) {
        if (i != selectionOriginal) options.push(i);
    }
    options = valuesToOptions(options);
    let selection = await mba.dialog("Metamagic: Transmute Spell", options, "Choose new damage type:");
    workflow.damageRoll._formula = workflow.damageRoll._formula.replace(selectionOriginal, selection);
    workflow.damageRoll.terms.forEach(term => term.options.flavor = term.options?.flavor?.replace(selectionOriginal, selection));
    await workflow.setDamageRoll(workflow.damageRoll);
    queue.remove(workflow.item.uuid);
}

async function twinnedSpellItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': "Metamagic: Twinned Spell",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of sorcery points equal to the spell's level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip).</p>
            <p>To be eligible, a spell must be incapable of targeting more than one creature at the spell's current level. For example, Magic Missile and Scorching Ray aren't eligible, but Ray of Frost and Chromatic Orb are.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.metamagic.twinnedSpellTrigger,postActiveEffects',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Spell']
            }
        }
    };
    await animation(workflow.token);
    await mba.createEffect(workflow.actor, effectData);
}

async function twinnedSpellTrigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    if (workflow.item.type != 'spell' || workflow.item.system.range.units === 'self' || workflow.item.flags["mba-premades"]?.metaMagic) return;
    let spellLevel = workflow.castData.castLevel;
    if (spellLevel === undefined) return;
    let pointsItem = mba.getItem(workflow.actor, 'Sorcery Points');
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < spellLevel) {
        ui.notifications.info(`Not enough sorcery points! (Need: ${spellLevel}, left: ${points})`);
        return;
    }
    let itemRange = workflow.item.system?.range?.value;
    if (!itemRange) {
        if (workflow.item.system.range.units === "touch") itemRange = 5;
        else return;
    }
    let actionType = workflow.item.system.actionType;
    if (!actionType) return;
    let disposition;
    switch (actionType) {
        case 'rsak':
        case 'msak':
        case 'savingThrow':
            disposition = 'enemy';
            break;
        case 'heal':
            disposition = 'ally';
            break;
        case 'utility':
        case 'other':
            disposition = null;
            break;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, "twinnedSpell", 450);
    if (!queueSetup) return;
    let nearbyTargets = mba.findNearby(workflow.token, itemRange, disposition, false, true).filter(t => t.id != workflow.targets.first().id);
    if (nearbyTargets.length === 0) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let selected = await mba.selectTarget("Metamagic: Twinned Spell", constants.yesNoButton, nearbyTargets, true, 'one', undefined, false, "<b>Choose target for Twinned Spell Metamagic:</b>");
    if (!selected.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let targetTokenUuid = selected.inputs.find(id => id);
    if (!targetTokenUuid) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let spellData = duplicate(workflow.item.toObject());
    setProperty(spellData, 'flags.mba-premades.metaMagic', true);
    spellData.system.components.concentration = false;
    let spell = new CONFIG.Item.documentClass(spellData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetTokenUuid], false, spellLevel);
    spell.prepareData();
    spell.prepareFinalAttributes();
    await warpgate.wait(100);
    await MidiQOL.completeItemUse(spell, config, options);
    if (spellLevel === 0) spellLevel = 1;
    await pointsItem.update({ 'system.uses.value': points - spellLevel });
    if (workflow.item.system.components.concentration) {
        let concentrationsTargets = workflow.actor?.flags['midi-qol']['concentration-data']?.targets;
        concentrationsTargets.splice(0, 0, { 'tokenUuid': targetTokenUuid, 'actorUuid': targetTokenUuid });
        await workflow.actor.setFlag('midi-qol', 'concentration-data.targets', concentrationsTargets);
    }
    queue.remove(workflow.item.uuid);
}

export let metamagic = {
    'animation': animation,
    'carefulSpellItem': carefulSpellItem,
    'carefulSpellTrigger': carefulSpellTrigger,
    'subtleSpellItem': subtleSpellItem,
    'quickenedSpellItem': quickenedSpellItem,
    'quickenedSpellTrigger': quickenedSpellTrigger,
    'transmutedSpellItem': transmutedSpellItem,
    'transmutedSpellTrigger': transmutedSpellTrigger,
    'twinnedSpellItem': twinnedSpellItem,
    'twinnedSpellTrigger': twinnedSpellTrigger,
}