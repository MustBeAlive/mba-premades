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
        await mba.playerDialogMessage();
        let selection = await mba.selectTarget('Careful spell targets: (Max ' + max + ')', constants.okCancel, chosenTargets, true, 'multiple');
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

export let metamagic = {
    'animation': animation,
    'carefulSpellItem': carefulSpellItem,
    'carefulSpellTrigger': carefulSpellTrigger,
    'subtleSpellItem': subtleSpellItem,
    'quickenedSpellItem': quickenedSpellItem,
    'quickenedSpellTrigger': quickenedSpellTrigger
}