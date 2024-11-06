import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do: check random spell cases with Spell Reflection (mostly works, prolems with synth workflows? (smite-like stuff))

async function rayRollItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, "Eye Ray: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find the passive effect! (Eye Ray: Passive)");
        return;
    }
    let resultName;
    let ammount = 4;
    if (effect.flags['mba-premades']?.feature?.spectator?.rays === 3) ammount = 3;
    if (ammount === 4) {
        let rayRoll = await new Roll("1d4").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(rayRoll);
        rayRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: "Spectator: Ray Randomiser"
        });
        switch (rayRoll.total) {
            case 1: resultName = "confusion"; break;
            case 2: resultName = "paralyze"; break;
            case 3: resultName = "fear"; break;
            case 4: resultName = "wound"; break;
        }
    }
    else if (ammount === 3) {
        let type = effect.flags['mba-premades']?.feature?.spectator?.used;
        console.log(type);
        let rayRoll = await new Roll("1d3").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(rayRoll);
        rayRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: "Spectator: Ray Randomiser"
        });
        if (type === "confusion") {
            switch (rayRoll.total) {
                case 1: resultName = "paralyze"; break;
                case 2: resultName = "fear"; break;
                case 3: resultName = "wound"; break;
            }
        }
        else if (type === "paralyze") {
            switch (rayRoll.total) {
                case 1: resultName = "confusion"; break;
                case 2: resultName = "fear"; break;
                case 3: resultName = "wound"; break;
            }
        }
        else if (type === "fear") {
            switch (rayRoll.total) {
                case 1: resultName = "confusion"; break;
                case 2: resultName = "paralyze"; break;
                case 3: resultName = "wound"; break;
            }
        }
        else if (type === "wound") {
            switch (rayRoll.total) {
                case 1: resultName = "confusion"; break;
                case 2: resultName = "paralyze"; break;
                case 3: resultName = "fear"; break;
            }
        }
    }
    console.log(resultName);
    if (!resultName) {
        ui.notifications.warn("Unable to define ray type!");
        return;
    }
    let animation;
    let featureData;
    switch (resultName) {
        case "confusion": {
            animation = "jb2a.scorching_ray.01.yellow";
            featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator: Confusion Ray", false);
            break;
        }
        case "paralyze": {
            animation = "jb2a.scorching_ray.01.pink";
            featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator: Fear Ray", false);
            break;
        }
        case "fear": {
            animation = "jb2a.scorching_ray.01.purple";
            featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator: Paralyzing Ray", false);
            break;
        }
        case "wound": {
            animation = "jb2a.scorching_ray.01.green";
            featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator: Wounding Ray", false);
            break;
        }
    }
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
            let updates = {
                'flags': {
                    'mba-premades': {
                        'feature': {
                            'spectator': {
                                'rays': 3,
                                'used': resultName
                            }
                        }
                    }
                }
            };
            await mba.updateEffect(effect, updates);
        })

        .play();
}

async function rayRollTurnStart(token) {
    let effect = await mba.findEffect(token.actor, "Eye Ray: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find the passive effect! (Eye Ray: Passive)");
        return;
    }
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'spectator': {
                        'rays': 4,
                        'used': ""
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function rayConfusionCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Spectator: Confusing Ray")) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.spectator.rayConfusionItem(token);
    };
    let effectData = {
        'name': "Spectator: Confusing Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You can't take reactions until the end of your next turn.</p>
            <p>On your turn, you are unable to move and use your action to make a melee or ranged attack against a randomly determined creature within range.</p>
            <p>If you are unable to attack anyone, you do nothing on your turn.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    let reaction = await mba.findEffect(target.actor, "Reaction");
    if (!reaction) await mba.addCondition(target.actor, "Reaction");
}

async function rayConfusionItem(token) {
    new Sequence()

        .effect()
        .file("jaamod.spells_effects.confusion")
        .attachTo(token)
        .scaleToObject(1)
        .fadeIn(500)
        .fadeOut(1000)

        .play()

    let validMeleeWeapons = token.actor.items.filter(i => i.type === "weapon" && i.system.equipped && i.system.actionType === "mwak");
    let MWR = 0;
    let MWN;
    if (validMeleeWeapons.length) {
        for (let weapon of validMeleeWeapons) {
            let newRange = weapon.system.range.value;
            if (newRange > MWR) {
                MWR = newRange;
                MWN = weapon.name;
            }
        }
    }
    let validRangedWeapons = token.actor.items.filter(i => i.type === "weapon" && i.system.equipped && i.system.actionType === "rwak");
    let RWR = 0;
    let RWN;
    if (validRangedWeapons.length) {
        for (let weapon of validRangedWeapons) {
            let newRange = weapon.system.range.value;
            if (newRange > RWR) {
                RWR = newRange;
                RWN = weapon.name;
            }
        }
    }
    let validSpells = token.actor.items.filter(i => i.type === "spell" && i.system.level < 1 && i.system.range?.value > 0);
    let SR = 0;
    let SN;
    if (validSpells.length) {
        for (let spell of validSpells) {
            let newRange = spell.system.range.value;
            if (newRange > SR) {
                SR = newRange;
                SN = spell.name;
            }
        }
    }
    let itemName;
    let range;
    if (MWR === 0 && RWR === 0 && SR === 0) {
        ChatMessage.create({
            content: `<p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>`,
            speaker: { actor: token.actor }
        });
        return;
    }
    else if (MWR > 0 && RWR === 0 && SR === 0) {
        itemName = MWN;
        range = MWR;
    }
    else if (MWR === 0 && RWR > 0 && SR === 0) {
        itemName = RWN;
        range = RWR;
    }
    else if (MWR === 0 && RWR === 0 && SR > 0) {
        itemName = SN;
        range = SR;
    }
    else if (MWR > 0 && RWR > 0 && SR === 0) {
        let decisionRoll = await new Roll("1d2").roll({ 'async': true });
        switch (decisionRoll.total) {
            case 1: itemName = MWN; range = MWR; break;
            case 2: itemName = RWN; range = RWR; break;
        }
    }
    else if (MWR > 0 && RWR === 0 && SR > 0) {
        let decisionRoll = await new Roll("1d2").roll({ 'async': true });
        switch (decisionRoll.total) {
            case 1: itemName = MWN; range = MWR; break;
            case 2: itemName = SN; range = SR; break;
        }
    }
    else if (MWR === 0 && RWR > 0 && SR > 0) {
        let decisionRoll = await new Roll("1d2").roll({ 'async': true });
        switch (decisionRoll.total) {
            case 1: itemName = RWN; range = RWR; break;
            case 2: itemName = SN; range = SR; break;
        }
    }
    else if (MWR > 0 && RWR > 0 && SR > 0) {
        let decisionRoll = await new Roll("1d3").roll({ 'async': true });
        switch (decisionRoll.total) {
            case 1: itemName = MWN; range = MWR; break;
            case 2: itemName = RWN; range = RWR; break;
            case 3: itemName = SN; range = SR; break;
        }
    }
    let nearbyTargets = await mba.findNearby(token, range, "any", false, false, true, true);
    if (!nearbyTargets.length) {
        ChatMessage.create({
            content: `<p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>`,
            speaker: { actor: token.actor }
        });
        return;
    }
    let target;
    if (nearbyTargets.length === 1) target = nearbyTargets[0];
    else {
        let targetRoll = await new Roll(`1d${nearbyTargets.length}`).roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(targetRoll);
        target = nearbyTargets[targetRoll.total - 1];
    }
    new Sequence()

        .thenDo(async () => {
            ChatMessage.create({
                content: `<p><b>${token.document.name}</b> must attack <u>${target.document.name}</u> using <u>${itemName}</u>.</p>`,
                speaker: { actor: token.actor }
            });
        })

        .effect()
        .file("jb2a.ui.indicator.redyellow.02.01")
        .attachTo(target)
        .scaleToObject(1.25)
        .duration(5000)
        .fadeOut(500)
        .scaleIn(0.5, 300, { ease: "easeOutCubic" })
        .loopProperty("sprite", "position.x", { values: [-50, 50, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
        .loopProperty("sprite", "position.y", { values: [-100, 100, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
        .zIndex(1)

        .effect()
        .file("jb2a.token_stage.round.red.02.01")
        .attachTo(target)
        .scaleToObject(1.25)
        .delay(2000)
        .duration(5000)
        .fadeOut(2000)
        .opacity(0.75)

        .play()
}

async function rayParalyzing({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "paralyzed")) return;
    if (mba.findEffect(target.actor, "Spectator: Paralyzing Ray")) return;
    const effectData = {
        'name': "Spectator: Paralyzing Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} by Spectator's Paralyzing Ray for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=13, saveMagic=false, name=Paralyzing Ray: Turn End (DC13), killAnim=true`,
                'priority': 20
            }
        ],
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayFearItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "frightened")) return;
    if (mba.findEffect(target.actor, "Spectator: Fear Ray")) return;
    async function effectMacroTurnEnd() {
        await mbaPremades.macros.monsters.spectator.rayFearTurnEnd(token);
    };
    const effectData = {
        'name': "Spectator: Fear Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Spectator's Fear Ray for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, with disadvantage if the spectator is visible to you, ending the effect on itself on a success.ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                }
            },
            'mba-premades': {
                'feature': {
                    'spectator': {
                        'fearRay': {
                            'originUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayFearTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Spectator: Fear Ray");
    if (!effect) {
        ui.notifications.warn("Unable to find the effect! (Spectator: Fear Ray)");
        return;
    }
    let originUuid = effect.flags['mba-premades']?.feature?.spectator?.fearRay?.originUuid;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator Fear Ray: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Spectator Fear Ray: Save (DC13)";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let [spectatorNearby] = await mba.findNearby(token, 200, "any", false, false, false, true).filter(t => t.document.uuid === originUuid);
    if (spectatorNearby) await mba.createEffect(token.actor, constants.disadvantageEffectData);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

async function spellReflectionAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.type === "spell") return;
    const spectator = Array.from(workflow.targets).find(t => t.name === "Spectator");
    if (workflow.attackTotal >= spectator.actor.system.attributes.ac.value) return;
    if (mba.findEffect(spectator.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'spellReflection', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Spectator: Spell Reflection", constants.yesNo, mba.firstOwner(spectator).id, `<b>Use Spell Reflection against <u>${workflow.item.name}</u>?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.purple")
        .attachTo(spectator)
        .scaleToObject(1.7)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.purple")
        .attachTo(spectator)
        .scaleToObject(1.7)
        .delay(600)
        .fadeIn(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name("Spectator Spell Reflection")

        .thenDo(async () => {
            let feature = await mba.getItem(spectator.actor, "Spell Reflection");
            if (feature) await feature.displayCard();
        })

        .play()

    let validTargets = await mba.findNearby(spectator, 30, "enemy", false, false, true, false).filter(t => t.document.uuid != workflow.token.document.uuid);
    if (!validTargets.length) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.remoteSelectTarget(mba.firstOwner(spectator).id, "Spell Reflection", constants.okCancel, validTargets, false, "one", undefined, false, "Select target to reflect the spell at:");
    await mba.clearGMDialogMessage();
    if (!selection.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let [newTargetId] = selection.inputs.filter(i => i).slice(0);
    let newTargetDoc = canvas.scene.tokens.get(newTargetId);
    let newTarget = newTargetDoc.object;
    let rollFormula = `${workflow.attackRoll._formula}`;
    let newAttackRoll = await new Roll(rollFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(newAttackRoll);
    workflow.targets.delete(spectator);
    workflow.hitTargets.delete(spectator);
    workflow.targets.add(newTarget);
    workflow.hitTargets.add(newTarget);
    workflow.setAttackRoll(newAttackRoll);
    queue.remove(workflow.item.uuid);
    new Sequence()

        .effect()
        .file("jb2a.shield.03.outro_explode.purple")
        .attachTo(spectator)
        .scaleToObject(1.7)
        .waitUntilFinished(-500)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `Spectator Spell Reflection` });
            await mba.addCondition(spectator.actor, "Reaction");
        })

        .play()
}

async function spellReflectionSave({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.type === "spell") return;
    const spectator = Array.from(workflow.targets).find(t => t.name === "Spectator");
    if (mba.findEffect(spectator.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'spellReflection', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Spectator: Spell Reflection", constants.yesNo, mba.firstOwner(spectator).id, `<b>Use Spell Reflection against <u>${workflow.item.name}</u>?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.purple")
        .attachTo(spectator)
        .scaleToObject(1.7)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.purple")
        .attachTo(spectator)
        .scaleToObject(1.7)
        .delay(600)
        .fadeIn(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name("Spectator Spell Reflection")

        .thenDo(async () => {
            let feature1 = await mba.getItem(spectator.actor, "Spell Reflection");
            if (feature1) await feature1.displayCard();
        })

        .play()

    let validTargets = await mba.findNearby(spectator, 30, "enemy", false, false, true, false).filter(t => t.document.uuid != workflow.token.document.uuid);
    if (!validTargets.length) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.remoteSelectTarget(mba.firstOwner(spectator).id, "Spell Reflection", constants.okCancel, validTargets, false, "one", undefined, false, "Select target to reflect the spell at:");
    await mba.clearGMDialogMessage();
    if (!selection.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let [newTargetId] = selection.inputs.filter(i => i).slice(0);
    let newTargetDoc = canvas.scene.tokens.get(newTargetId);
    let newTarget = newTargetDoc.object;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Spectator Spell Reflection: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Spell Reflection: Save";
    featureData.system.save.dc = workflow.item.system.save.dc;
    featureData.system.save.ability = workflow.item.system.save.ability;
    workflow.targets.delete(spectator);
    workflow.hitTargets.delete(spectator);
    workflow.saves.delete(spectator);
    workflow.targets.add(newTarget);
    workflow.hitTargets.add(newTarget);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([newTargetDoc.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        workflow.saves.add(newTarget);
        new Sequence()

            .effect()
            .file("jb2a.shield.03.outro_explode.purple")
            .attachTo(spectator)
            .scaleToObject(1.7)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `Spectator Spell Reflection` });
                await mba.addCondition(spectator.actor, "Reaction");
            })

            .play()
    }
    else {
        workflow.failedSaves.add(newTarget);
        queue.remove(workflow.item.uuid);
        new Sequence()
    
            .effect()
            .file("jb2a.shield.03.outro_explode.purple")
            .attachTo(spectator)
            .scaleToObject(1.7)
            .waitUntilFinished(-500)
    
            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `Spectator Spell Reflection` });
                await mba.addCondition(spectator.actor, "Reaction");
            })
    
            .play()
    }
}

export let spectator = {
    'rayRollItem': rayRollItem,
    'rayRollTurnStart': rayRollTurnStart,
    'rayConfusionCast': rayConfusionCast,
    'rayConfusionItem': rayConfusionItem,
    'rayParalyzing': rayParalyzing,
    'rayFearItem': rayFearItem,
    'rayFearTurnEnd': rayFearTurnEnd,
    'spellReflectionAttack': spellReflectionAttack,
    'spellReflectionSave': spellReflectionSave
}