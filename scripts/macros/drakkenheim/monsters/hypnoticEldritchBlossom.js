import {constants} from "../../generic/constants.js";
import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function nectar({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    await contamination.addContamination(workflow.targets.first())
}

async function hypnoticPollenCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = await mba.findNearby(workflow.token, 30, "any", false, false);
    if (!targets.length) return;
    let targetIds = [];
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "charmed")) continue;
        if (mba.findEffect(target.actor, "Hypnotic Pollen")) continue;
        targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
    new Sequence()

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.01")
        .attachTo(workflow.token)
        .scale(3.8)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(750)
        .fadeOut(500)
        .opacity(0.7)
        .repeats(2, 500)
        .tint("#d400ff")

        .play()
}

async function hypnoticPollenItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} HypPol` })
    }
    const effectData = {
        'name': "Hypnotic Pollen",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by the Eldritch Blossom's Hypnotic Pollen for the duration.</p>
            <p>While @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}, you are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} and must use all of your movement on each of your turns to get as close to the Eldritch Blossom as possible.</p>
            <p>The effect ends if you take any damage or if someone else uses an action to shake you out of this stupor.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Charmed",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Incapacitated",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged', 'zeroHP'],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

        .effect()
        .file("jb2a.particles.outward.purple.01.02")
        .attachTo(target)
        .scaleToObject(1.3)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} HypPol`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
    }
}

async function spellReflectionAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.type === "spell") return;
    const blossom = Array.from(workflow.targets).find(t => t.name === "Hypnotic Eldritch Blossom");
    if (workflow.attackTotal >= blossom.actor.system.attributes.ac.value) return;
    if (mba.findEffect(blossom.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'spellReflection', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Hypnotic Eldritch Blossom: Spell Reflection", constants.yesNo, mba.firstOwner(blossom).id, `<b>Use Spell Reflection against <u>${workflow.item.name}</u>?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.purple")
        .attachTo(blossom)
        .scaleToObject(1.7)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.purple")
        .attachTo(blossom)
        .scaleToObject(1.7)
        .delay(600)
        .fadeIn(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name("HEBSpR")

        .thenDo(async () => {
            let feature = await mba.getItem(blossom.actor, "Spell Reflection");
            if (feature) await feature.displayCard();
        })

        .play()

    let validTargets = await mba.findNearby(blossom, 30, "enemy", false, false, true, false).filter(t => t.document.uuid != workflow.token.document.uuid);
    if (!validTargets.length) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.remoteSelectTarget(mba.firstOwner(blossom).id, "Spell Reflection", constants.okCancel, validTargets, false, "one", undefined, false, "Select target to reflect the spell at:");
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
    workflow.targets.delete(blossom);
    workflow.hitTargets.delete(blossom);
    workflow.targets.add(newTarget);
    workflow.hitTargets.add(newTarget);
    workflow.setAttackRoll(newAttackRoll);
    queue.remove(workflow.item.uuid);
    new Sequence()

        .effect()
        .file("jb2a.shield.03.outro_explode.purple")
        .attachTo(blossom)
        .scaleToObject(1.7)
        .waitUntilFinished(-500)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `HEBSpR` });
            await mba.addCondition(blossom.actor, "Reaction");
        })

        .play()
}

async function spellReflectionSave({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.type === "spell") return;
    const blossom = Array.from(workflow.targets).find(t => t.name === "Hypnotic Eldritch Blossom");
    if (mba.findEffect(blossom.actor, "Reaction")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'spellReflection', 101);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let reaction = await mba.remoteDialog("Hypnotic Eldritch Blossom: Spell Reflection", constants.yesNo, mba.firstOwner(blossom).id, `<b>Use Spell Reflection against <u>${workflow.item.name}</u>?</b>`);
    if (!reaction) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.purple")
        .attachTo(blossom)
        .scaleToObject(1.7)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.purple")
        .attachTo(blossom)
        .scaleToObject(1.7)
        .delay(600)
        .fadeIn(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name("HEBSpR")

        .thenDo(async () => {
            let feature1 = await mba.getItem(blossom.actor, "Spell Reflection");
            if (feature1) await feature1.displayCard();
        })

        .play()

    let validTargets = await mba.findNearby(blossom, 30, "enemy", false, false, true, false).filter(t => t.document.uuid != workflow.token.document.uuid);
    if (!validTargets.length) {
        await mba.clearGMDialogMessage();
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.remoteSelectTarget(mba.firstOwner(blossom).id, "Spell Reflection", constants.okCancel, validTargets, false, "one", undefined, false, "Select target to reflect the spell at:");
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
    workflow.targets.delete(blossom);
    workflow.hitTargets.delete(blossom);
    workflow.saves.delete(blossom);
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
            .attachTo(blossom)
            .scaleToObject(1.7)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `HEBSpR` });
                await mba.addCondition(blossom.actor, "Reaction");
            })

            .play()
    }
    else {
        workflow.failedSaves.add(newTarget);
        queue.remove(workflow.item.uuid);
        new Sequence()
    
            .effect()
            .file("jb2a.shield.03.outro_explode.purple")
            .attachTo(blossom)
            .scaleToObject(1.7)
            .waitUntilFinished(-500)
    
            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `HEBSpR` });
                await mba.addCondition(blossom.actor, "Reaction");
            })
    
            .play()
    }
}

export let hypnoticEldritchBlossom = {
    'nectar': nectar,
    'hypnoticPollenCast': hypnoticPollenCast,
    'hypnoticPollenItem': hypnoticPollenItem,
    'spellReflectionAttack': spellReflectionAttack,
    'spellReflectionSave': spellReflectionSave
}