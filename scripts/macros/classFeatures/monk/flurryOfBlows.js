import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function flurryOfBlows({ speaker, actor, token, character, item, args, scope, workflow }) {
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 1) {
        ui.notifications.info("Not enough Ki Points!");
        return;
    }
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let subClassIdentifier = workflow.actor.classes.monk?.subclass?.identifier;
    let maxAttacks = 2;
    let mercyHealCounter = 1;
    if (subClassIdentifier === "way-of-mercy" && monkLevel >= 11) mercyHealCounter = 99;
    if (subClassIdentifier === "way-of-the-drunken-master") {
        let effectDataDrunkenMaster = {
            'name': "Flurry of Blows: Drunken Master",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You gain the benefit of the @UUID[Compendium.mba-premades.MBA Actions.Item.iIbA6tocw4h3lhqN]{Disengage} action, and your walking speed increases by 10 feet until the end of the current turn.</p>
            `,
            'duration': {
                'turns': 1
            },
            'changes': [
                {
                    'key': 'system.attributes.movement.walk',
                    'mode': 2,
                    'value': '+10',
                    'priority': 20
                }
            ],
        };
        let actionName = "Disengage";
        let action = await mba.getItem(workflow.actor, actionName);
        if (action) {
            await action.use();
            return;
        }
        let actionData = await mba.getItemFromCompendium('mba-premades.MBA Actions', actionName, false);
        if (!actionData) {
            ui.notifications.warn(`Unable to find item in the compendium! (${actionName})`);
            return;
        }
        action = new CONFIG.Item.documentClass(actionData, { parent: workflow.actor });
        let options = {
            'showFullCard': false,
            'createWorkflow': true,
            'targetUuids': [workflow.token.document.uuid],
            'configureDialog': false,
            'versatile': false,
            'consumeResource': false,
            'consumeSlot': false,
            'workflowOptions': {
                'autoRollDamage': 'always',
                'autoFastDamage': true
            }
        };
        await MidiQOL.completeItemUse(action, {}, options);
        await mba.createEffect(workflow.actor, effectDataDrunkenMaster);
    }
    let feature = await mba.getItem(workflow.actor, "Unarmed Strike (Monk)");
    if (!feature) {
        ui.notifications.warn("Unable to find item! (Unarmed Strike (Monk))");
        return;
    }
    feature.prepareData();
    feature.prepareFinalAttributes();
    let [config, options] = constants.syntheticItemWorkflowOptions([]);
    let queueSetup = await queue.setup(workflow.item.uuid, 'flurryOfBlows', 50);
    if (!queueSetup) return;
    await kiItem.update({ "system.uses.value": kiPoints -= 1 });
    let firstRun = true;
    let skipDead = true;
    while (maxAttacks > 0) {
        let nearbyTargets;
        if (firstRun) {
            nearbyTargets = mba.findNearby(workflow.token, feature.system.range.value, 'enemy', true);
            if (!nearbyTargets.length) {
                let choices = [["Try Again (Press after Repositioning)", true], ["Cancel Flurry of Blows", false]];
                let failSafe = await mba.dialog("Flurry of Blows", choices, "<p>Unable to find targets nearby!</p><p>What would you like to do?</p>");
                if (!failSafe) {
                    await kiItem.update({ "system.uses.value": kiPoints += 1 });
                    queue.remove(workflow.item.uuid);
                    return;
                }
                nearbyTargets = mba.findNearby(workflow.token, feature.system.range.value, 'enemy', true);
                if (!nearbyTargets.length) {
                    ui.notifications.warn("Still unable to find targets, something is wrong!");
                    await kiItem.update({ "system.uses.value": kiPoints += 1 });
                    queue.remove(workflow.item.uuid);
                    return;
                }
            }
            firstRun = false;
        } else {
            let movementCheck = await mba.dialog("Flurry of Blows: Reposition", [["Proceed", 1]], "<p>Promt to be able to reposition actor between the attacks.</p><p><b>Press the button ONLY when ready to continue.</b></p>");
            nearbyTargets = mba.findNearby(workflow.token, feature.system.range.value, 'enemy', true);
            if (!nearbyTargets.length) {
                let choices = [["Try Again (Press after Repositioning)", true], ["Cancel Flurry of Blows", false]];
                let failSafe = await mba.dialog("Flurry of Blows", choices, "<p>Unable to find targets nearby!</p><p>What would you like to do?</p>");
                if (!failSafe) {
                    queue.remove(workflow.item.uuid);
                    return;
                }
                nearbyTargets = mba.findNearby(workflow.token, feature.system.range.value, 'enemy', true);
                if (!nearbyTargets.length) {
                    ui.notifications.warn("Still unable to find targets, something is wrong!");
                    queue.remove(workflow.item.uuid);
                    return;
                }
            }
        }
        let targets = skipDead ? nearbyTargets.filter(i => i.actor.system.attributes.hp.value > 0) : nearbyTargets;
        let content = `Select your targets: (Total Attacks: ${maxAttacks})`;
        //if (subClassIdentifier === "way-of-the-drunken-master" && monkLevel >= 17) content = `<p>Select your targets:</p><p>(Total Attacks: ${maxAttacks} + up to 3 (different target each))</p>`;
        let selection = await mba.selectTarget("Flurry of Blows", constants.okCancel, targets, true, 'number', null, true, content);
        if (!selection.buttons) {
            queue.remove(workflow.item.uuid);
            return;
        }
        let total = 0;
        for (let i = 0; i < (selection.inputs.length - 1); i++) {
            if (!isNaN(selection.inputs[i])) total += selection.inputs[i];
        }
        if (total > maxAttacks) {
            ui.notifications.warn("You can't use that many attacks, try again!");
            continue;
        }
        skipDead = selection.inputs[selection.inputs.length - 1];
        for (let i = 0; i < selection.inputs.length - 1; i++) {
            if (isNaN(selection.inputs[i]) || selection.inputs[i] === 0) continue;
            let target = fromUuidSync(targets[i].document.uuid).object;
            if (skipDead) {
                if (target.actor?.system?.attributes?.hp?.value < 1) continue;
            }
            options.targetUuids = [target.document.uuid];
            let attackCount = 0;
            for (let j = 0; j < selection.inputs[i]; j++) {
                await warpgate.wait(100);
                /*
                if (subClassIdentifier === "way-of-mercy" && monkLevel >= 3) {
                    let mercyChoices = [];
                    if (mercyHealCounter > 0) mercyChoices.push([`Hand of Healing`, "heal"]);
                    let handOfHarm = await mba.getItem(workflow.actor, "Hand of Harm");
                    if (mba.perTurnCheck(handOfHarm, "feature", "handOfHarm")) mercyChoices.push(["Hand of Harm", "harm"]);
                    if (!mercyChoices.length) continue;
                    let mercySelection = await mba.dialog("Flurry of Blows: Way of Mercy", mercyChoices, `<b></b>`);
                    if (!mercySelection) continue;
                    if (mercySelection === "heal") {
                        let effectDataMercy = {
                            'name': "Flurry of Blows: Hand of Healing",
                            'icon': "modules/mba-premades/icons/class/monk/hand_of_healing.webp",
                            'origin': workflow.item.uuid,
                        };
                        await mba.createEffect(workflow.actor, effectDataMercy);
                        feature = await mba.getItem(workflow.actor, "Hand of Healing"); 
                    }
                    else if (mercySelection === "harm") {
                        let effectDataMercy = {
                            'name': "Flurry of Blows: Hand of Harm",
                            'icon': "modules/mba-premades/icons/class/monk/hand_of_harm.webp",
                            'origin': workflow.item.uuid, 
                        };
                        await mba.createEffect(workflow.actor, effectDataMercy);
                    }
                }*/
                maxAttacks -= 1;
                let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
                attackCount += 1;
                if (target.actor.system.attributes.hp.value < 1) j = selection.inputs[i];
                if (subClassIdentifier === "way-of-open-hand" && monkLevel >= 3 && featureWorkflow.hitTargets.size) {
                    let openHandEffects = [];
                    if (!mba.findEffect(target.actor, "Prone")) openHandEffects.push([`Knock Prone (DEX Save)`, "prone", "modules/mba-premades/icons/class/monk/flurry_of_blows_topple.webp"]);
                    openHandEffects.push(
                        ["Push up to 15 feet (STR Save)", "push", "modules/mba-premades/icons/class/monk/flurry_of_blows_push.webp"],
                        ["Disable reactions", "stagger", "modules/mba-premades/icons/class/monk/flurry_of_blows_stagger.webp"]
                    );                  
                    let openHand = await mba.selectImage("Open Hand Technique", openHandEffects, `Choose effect to impose on <b>${target.document.name}</b>:`, "value");
                    if (!openHand) continue;
                    let saveDC = 8 + workflow.actor.system.attributes.prof + workflow.actor.system.abilities.wis.mod;
                    if (openHand === "prone") {
                        let saveRoll = await mba.rollRequest(target, 'save', 'dex');
                        if (saveRoll.total >= saveDC) continue;
                        await mba.addCondition(target.actor, "Prone"); 
                    }
                    else if (openHand === "push") {
                        let saveRoll = await mba.rollRequest(target, 'save', 'str');
                        if (saveRoll.total >= saveDC) continue;
                        let choicesDistance = [["5 feet", 5], ["10 feet", 10], ["15 feet", 15]];
                        let selectionDistance = await mba.dialog("Open Hand Technique: Push", choicesDistance, `How far would you like to push <b>${target.document.name}</b>?`);
                        if (!selectionDistance) continue;
                        await mba.pushToken(workflow.token, target, selectionDistance);
                    }
                    else if (openHand === "stagger") { // Cringe, but the only way to do
                        async function effectMacroTurnStart() {
                            let reaction = await mbaPremades.helpers.findEffect(actor, "Reaction");
                            if (!reaction) await mbaPremades.helpers.addCondition(actor, "Reaction");
                        };
                        async function effectMacroDel() {
                            let reaction = await mbaPremades.helpers.findEffect(actor, "Reaction");
                            if (reaction) await mbaPremades.helpers.removeCondition(actor, "Reaction");
                        };
                        const effectDataStagger = {
                            'name': "Open Hand Technique: Stagger",
                            'icon': "modules/mba-premades/icons/class/monk/flurry_of_blows_stagger.webp",
                            'origin': workflow.item.uuid,
                            'description': `
                                <p>You can't take reactions until the end of ${workflow.token.document.name}'s next turn.</p>
                            `,
                            'flags': {
                                'dae': {
                                    'showIcon': true,
                                    'specialDuration': ['turnEndSource']
                                },
                                'effectmacro': {
                                    'onTurnStart': {
                                        'script': mba.functionToString(effectMacroTurnStart)
                                    },
                                    'onDelete': {
                                        'script': mba.functionToString(effectMacroDel)
                                    }
                                }
                            }
                        };
                        await mba.createEffect(target.actor, effectDataStagger);
                        if (!mba.findEffect(target.actor, "Reaction")) await mba.addCondition(target.actor, "Reaction");
                    }
                }
            }
        }
    }
    queue.remove(workflow.item.uuid);



    /* Old/Temp Animation Setup
    let animation;
    let hue = 0;
    let target = workflow.targets.first();
    switch (subClassIdentifier) {
        case "way-of-the-ascendant-dragon": {
            let colorRoll = await new Roll("1d3").roll({ 'async': true });
            switch (colorRoll.total) {
                case 1: {
                    animation = "jb2a.flurry_of_blows.physical.green";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.green";
                    break;
                }
                case 2: {
                    animation = "jb2a.flurry_of_blows.physical.blue";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.blue";
                    break;
                }
                case 3: {
                    animation = "jb2a.flurry_of_blows.physical.orange";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.orange";
                    break;
                }
            }
            break;
        }
        case "way-of-the-astral-self": {
            animation = "jb2a.flurry_of_blows.physical.pinkpurple";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.pinkpurple";
            break;
        }
        case "way-of-the-drunken-master": {
            animation = "jb2a.flurry_of_blows.physical.orange";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.orange";
            break;
        }
        case "way-of-the-four-elements": {
            let colorRoll = await new Roll("1d3").roll({ 'async': true });
            switch (colorRoll.total) {
                case 1: {
                    animation = "jb2a.flurry_of_blows.physical.green";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.green";
                    break;
                }
                case 2: {
                    animation = "jb2a.flurry_of_blows.physical.blue";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.blue";
                    break;
                }
                case 3: {
                    animation = "jb2a.flurry_of_blows.physical.orange";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.orange";
                    break;
                }
                case 4: {
                    animation = "jb2a.flurry_of_blows.physical.yellow";
                    if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.yellow";
                    break;
                }
            }
            break;
        }
        case "way-of-the-kensei": {
            animation = "jb2a.flurry_of_blows.physical.yellow";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.yellow";
            break;
        }
        case "way-of-the-long-death": {
            animation = "jb2a.flurry_of_blows.physical.green";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.green";
            break;
        }
        case "way-of-mercy": {
            animation = "jb2a.flurry_of_blows.physical.green";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.green";
            break;
        }
        case "way-of-open-hand": {
            animation = "jb2a.flurry_of_blows.physical.blue";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.blue";
            break;
        }
        case "way-of-shadow": {
            animation = "jb2a.flurry_of_blows.physical.dark_purple";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.dark_purple";
            break;
        }
        case "way-of-the-sun-soul": {
            animation = "jb2a.flurry_of_blows.physical.orange";
            if (monkLevel >= 6) animation = "jb2a.flurry_of_blows.magical.02.orange";
            hue = 320;
            break;
        }
    }

    new Sequence()

        .effect()
        .file(animation)
        .attachTo(workflow.token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: hue })

        .thenDo(async () => {
            await kiItem.update({ "system.uses.value": kiPoints -= 1 });
        })

        .play()

    */
}