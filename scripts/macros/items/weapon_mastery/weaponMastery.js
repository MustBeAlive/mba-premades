import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do: cleave/graze magic damage?

async function trigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    let flags = workflow.actor.flags['mba-premades']?.weaponMastery;
    if (!flags) return;
    let target = workflow.targets.first();
    let range = workflow.item.system.range.value;
    let cleaveValidTargets = await mba.findNearby(workflow.token, range, "enemy", false, false).filter(t => t.document.uuid != target.document.uuid);
    let [vexEffect] = target.actor.effects.filter(e => e.flags['mba-premades']?.feature?.vex?.originUuid === workflow.token.document.uuid);
    let choices = [];
    let push = false;
    let sap = false;
    let slow = false;
    for (let [key, value] of Object.entries(flags)) {
        if (!value) continue;
        if (workflow.hitTargets.size && cleaveValidTargets.length && constants.weaponTypes.cleave.includes(workflow.item.system.baseItem) && key === "cleave" && value === 1) choices.push(["Cleave", "cleave"]);
        else if (!workflow.hitTargets.size && constants.weaponTypes.graze.includes(workflow.item.system.baseItem) && key === "graze" && value === 1) choices.push(["Graze", "graze"]);
        else if (!push && workflow.hitTargets.size && constants.weaponTypes.push.includes(workflow.item.system.baseItem) && key === "push" && value === 1 || (workflow.hitTargets.size && mba.findEffect(workflow.actor, "Tactical Master") && !push)) {
            choices.push(["Push", "push"]);
            push = true;
        }
        else if (!sap && workflow.hitTargets.size && !mba.findEffect(target.actor, "Sap") && constants.weaponTypes.sap.includes(workflow.item.system.baseItem) && key === "sap" && value === 1 || (workflow.hitTargets.size && !mba.findEffect(target.actor, "Sap") && mba.findEffect(workflow.actor, "Tactical Master") && !sap)) {
            choices.push(["Sap", "sap"]);
            sap = true;
        }
        else if (!slow && workflow.hitTargets.size && !mba.findEffect(target.actor, "Slow") && constants.weaponTypes.slow.includes(workflow.item.system.baseItem) && key === "slow" && value === 1|| (workflow.hitTargets.size && !mba.findEffect(target.actor, "Slow") && mba.findEffect(workflow.actor, "Tactical Master") && !slow)) {
            choices.push(["Slow", "slow"]);
            slow = true;
        }
        else if (workflow.hitTargets.size && !mba.findEffect(target.actor, "Prone") && constants.weaponTypes.topple.includes(workflow.item.system.baseItem) && key === "topple" && value === 1) choices.push(["Topple", "topple"]);
        else if (workflow.hitTargets.size && !vexEffect && constants.weaponTypes.vex.includes(workflow.item.system.baseItem) && key === "vex" && value === 1) choices.push(["Vex", "vex"]);
    }
    if (!choices.length) return;
    let selection;
    if (choices.length === 1) selection = choices[0][1];
    if (!selection) {
        await mba.playerDialogMessage(game.user);
        selection = await mba.dialog("Weapon Mastery", choices, "<b>Choose weapon mastery to use:</b>");
        await mba.clearPlayerDialogMessage();
    }
    if (!selection) return;
    if (selection === "cleave") {
        if (choices.length < 2) {
            let promt = await mba.dialog("Cleave", constants.yesNo, "<b>Would you like to use Cleave?</b>")
            if (!promt) return;
        }
        await mba.playerDialogMessage(game.user);
        let selection = await mba.selectTarget("Cleave", constants.okCancel, cleaveValidTargets, true, "one", undefined, false, "<b>Select target to cleave:</b>")
        await mba.clearPlayerDialogMessage();
        if (!selection.buttons) return;
        let [targetUuid] = selection.inputs.filter(i => i).slice(0);
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', "Cleave", false);
        if (!featureData) return;
        delete featureData._id;
        let weaponDamage = workflow.item.system.damage.parts[0][0];
        let newDamage = weaponDamage.replace("+ @mod", "").trim();
        let damageType = workflow.item.system.damage.parts[0][1];
        featureData.system.attackBonus = workflow.actor.system.attributes.prof;
        featureData.system.damage.parts = [[`${newDamage}[${damageType}]`, `${damageType}`]];
        //if (workflow.item.system.properties.mgc === true) featureData.system.properties.push('mgc'); borked
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([targetUuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    else if (selection === "graze") {
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', "Graze", false);
        if (!featureData) return;
        delete featureData._id;
        let damage = workflow.attackTotal - workflow.d20AttackRoll - workflow.actor.system.attributes.prof;
        let damageType = workflow.item.system.damage.parts[0][1];
        featureData.system.damage.parts = [[`${damage}[${damageType}]`, `${damageType}`]];
        //if (workflow.item.system.properties.mgc === true) featureData.system.properties.push('mgc'); borked
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    else if (selection === "push") {
        if (mba.getSize(target.actor) > (mba.getSize(workflow.actor) + 1)) return;
        if (choices.length < 2) {
            await mba.playerDialogMessage(game.user);
            let promt = await mba.dialog("Push", constants.yesNo, `Would you like to Push <u>${target.document.name}</u> 10 feet away?`);
            await mba.clearPlayerDialogMessage();
            if (!promt) return;
        }
        await mba.pushToken(workflow.token, target, 10);
    }
    else if (selection === "sap") {
        if (choices.length < 2) {
            await mba.playerDialogMessage(game.user);
            let promt = await mba.dialog("Sap", constants.yesNo, `Would you like to Sap <u>${target.document.name}</u>?`);
            await mba.clearPlayerDialogMessage();
            if (!promt) return;
        }
        let effectData = {
            'name': "Sap",
            'icon': "modules/mba-premades/icons/mastery/sapped.webp",
            'origin': workflow.item.uuid,
            'description': `
                    <p>You have disadvantage on the next attack roll you make before the start of ${workflow.token.document.name} next turn.</p>
                `,
            'changes': [
                {
                    'key': 'flags.midi-qol.disadvantage.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['1Attack', 'turnStartSource']
                },
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
    else if (selection === "slow") {
        if (choices.length < 2) {
            await mba.playerDialogMessage(game.user);
            let promt = await mba.dialog("Slow", constants.yesNo, `Would you like to Slow <u>${target.document.name}</u>?`);
            await mba.clearPlayerDialogMessage();
            if (!promt) return;
        }
        let effectData = {
            'name': "Slow",
            'icon': "modules/mba-premades/icons/mastery/slow.webp",
            'origin': workflow.item.uuid,
            'description': `
                    <p>You have -10 penalty to your speed until the start of ${workflow.token.document.name} turn.</p>
                `,
            'changes': [
                {
                    'key': 'system.attributes.movement.all',
                    'mode': 0,
                    'value': "-10",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStartSource']
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
    else if (selection === "topple") {
        if (choices.length < 2) {
            await mba.playerDialogMessage(game.user);
            let promt = await mba.dialog("Topple", constants.yesNo, `Would you like to Topple <u>${target.document.name}</u>?`);
            await mba.clearPlayerDialogMessage();
            if (!promt) return;
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', "Topple", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.save.dc = 8 + (workflow.attackTotal - workflow.d20AttackRoll) + workflow.actor.system.attributes.prof;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) return;
        await mba.addCondition(target.actor, "Prone");
    }
    else if (selection === "vex") {
        let effectDataSource = {
            'name': "Vex",
            'icon': "modules/mba-premades/icons/mastery/vex.webp",
            'origin': workflow.item.uuid,
            'description': `
                    <p>You have advantage on your next attack roll against ${target.document.name} before the end of your next turn.</p>
                `,
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.weaponMastery.vexBonus,preAttackRoll',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.weaponMastery.vexAttackComplete,postActiveEffects',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnEndSource']
                },
                'mba-premades': {
                    'feature': {
                        'vex': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        };
        let effectDataTarget = {
            'name': "Vexed",
            'icon': "modules/mba-premades/icons/mastery/vexed.webp",
            'origin': workflow.item.uuid,
            'description': `
                    <p>${workflow.token.document.name} has advantage on the next attack roll against you before the end of his next turn.</p>
                `,
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnEndSource']
                },
                'mba-premades': {
                    'feature': {
                        'vex': {
                            'originUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        };
        await mba.createEffect(workflow.actor, effectDataSource);
        await mba.createEffect(target.actor, effectDataTarget);
    }
}

async function vexBonus({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let target = workflow.targets.first();
    let [targetEffect] = target.actor.effects.filter(e => e.flags['mba-premades']?.feature?.vex?.originUuid === workflow.token.document.uuid);
    if (!targetEffect) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'vex', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Vex");
    queue.remove(workflow.item.uuid);
}

async function vexAttackComplete({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [targetEffect] = target.actor.effects.filter(e => e.flags['mba-premades']?.feature?.vex?.originUuid === workflow.token.document.uuid);
    let [originEffect] = workflow.actor.effects.filter(e => e.flags['mba-premades']?.feature?.vex?.targetUuid === target.document.uuid);
    if (targetEffect) await mba.removeEffect(targetEffect);
    if (originEffect) await mba.removeEffect(originEffect);
}

export let weaponMastery = {
    'trigger': trigger,
    'vexBonus': vexBonus,
    'vexAttackComplete': vexAttackComplete
}