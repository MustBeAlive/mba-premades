async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let classIdentifier = chrisPremades.helpers.getConfiguration(workflow.item, 'classidentifier') ?? 'bard';
    let scaleIdentifier = chrisPremades.helpers.getConfiguration(workflow.item, 'scaleidentifier') ?? 'bardic-inspiration';
    let scale = workflow.actor.system.scale[classIdentifier]?.[scaleIdentifier];
    if (!scale) {
        ui.notifications.warn('Actor does not appear to have a Bardic Inspiration scale set!');
        return;
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You were bestowed with Bardic Inspiration <b>(Die Size: 1${scale.formula})</b>.</p>
            <p>Once within the next 10 minutes you can roll the die and add the number rolled to one ability check, attack roll, or saving throw.</p>
            <p>You can wait until after you roll the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails</p>
            <p>Once the Bardic Inspiration die is rolled, it is lost.</p>
            <p>You can have only one Bardic Inspiration die at a time.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.bardicInspiration.attack,preCheckHits',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.label',
                'mode': 5,
                'value': 'Bardic Inspiration',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.save.all',
                'mode': 5,
                'value': scale.formula,
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'feature': {
                    'bardicInspiration': scale.formula
                }
            }
        }
    };
    let moteOfPotentialeOfPotential = chrisPremades.helpers.getItem(workflow.actor, 'Mote of Potential');
    if (moteOfPotentialeOfPotential) {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.check.all',
                'mode': 5,
                'value': '2' + scale.die + 'kh',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.skill.all',
                'mode': 5,
                'value': '2' + scale.die + 'kh',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.macroToCall',
                'mode': 5,
                'value': 'function.mbaPremades.macros.moteOfPotential',
                'priority': 20
            }
        );
        setProperty(effectData, 'flags.mba-premades.feature.moteOfPotential', chrisPremades.helpers.getSpellDC(workflow.item));
    } else {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.check.all',
                'mode': 5,
                'value': scale.formula,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.skill.all',
                'mode': 5,
                'value': scale.formula,
                'priority': 20
            }
        );
    }
    let magicalInspiration = chrisPremades.helpers.getItem(workflow.actor, 'Magical Inspiration');
    if (magicalInspiration) {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.bardicInspiration.damage,preDamageApplication',
                'priority': 20
            }

        );
    }
    await chrisPremades.helpers.createEffect(workflow.targets.first().actor, effectData);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size || workflow.isFumble) return;
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, "Bardic Inspiration");
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'bardicInspiration', 150);
    if (!queueSetup) return;
    let selection = await chrisPremades.helpers.dialog(effect.name, chrisPremades.constants.yesNo, 'Use ' + effect.name + '? (Attack Total: ' + workflow.attackTotal + ' )');
    if (!selection) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    let bardDice = effect.flags['mba-premades'].feature.bardicInspiration;
    await chrisPremades.helpers.removeEffect(effect);
    let updatedRoll = await chrisPremades.helpers.addToRoll(workflow.attackRoll, bardDice);
    workflow.setAttackRoll(updatedRoll);
    let moteOfPotential = effect.flags['mba-premades'].feature.moteOfPotential;
    if (moteOfPotential) {
        let bardDie = updatedRoll.terms[updatedRoll.terms.length - 1].total;
        let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Mote of Potential Attack', false);
        if (!featureData) {
            chrisPremades.queue.remove(workflow.item.uuid);
            return;
        }
        featureData.system.save.dc = moteOfPotential;
        featureData.system.damage.parts = [
            [
                bardDie + '[thunder]',
                'thunder'
            ]
        ];
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let newTargets = await chrisPremades.helpers.findNearby(workflow.targets.first(), 5, 'ally', false, true).map(i => i.document.uuid);
        let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(newTargets);
        await warpgate.wait(100);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    chrisPremades.queue.remove(workflow.item.uuid);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size || workflow.item.type != 'spell') return;
    if ((workflow.item.system.actionType === 'rsak' || workflow.item.system.actionType === 'msak') && !workflow.hitTargets.size) return;
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, "Bardic Inspiration");
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'bardicInspiration', 150);
    if (!queueSetup) return;
    let selection = await chrisPremades.helpers.selectTarget('Use Magical Inspiration?', chrisPremades.constants.yesNoButton, workflow.targets, false, 'one');
    if (!selection.buttons) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    let bardDice = effect.flags['mba-premades'].feature.bardicInspiration;
    await chrisPremades.helpers.removeEffect(effect);
    let targetTokenID = selection.inputs.find(i => i);
    if (!targetTokenID) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    let targetDamage = workflow.damageList.find(i => i.tokenId === targetTokenID);
    let defaultDamageType = workflow.defaultDamageType;
    let roll = await new Roll(bardDice + '[' + defaultDamageType + ']').roll({ 'async': true });
    roll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Magical Inspiration'
    });
    let targetActor = canvas.scene.tokens.get(targetDamage.tokenId).actor;
    if (!targetActor) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    let hasDI = chrisPremades.helpers.checkTrait(targetActor, 'di', defaultDamageType);
    if (hasDI) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    let damageTotal = roll.total;
    let hasDR = chrisPremades.helpers.checkTrait(targetActor, 'dr', defaultDamageType);
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    targetDamage.damageDetail[0].push(
        {
            'damage': damageTotal,
            'type': defaultDamageType
        }
    );
    targetDamage.totalDamage += damageTotal;
    if (defaultDamageType === 'healing') {
        targetDamage.newHP += roll.total;
        targetDamage.hpDamage -= damageTotal;
        targetDamage.appliedDamage -= damageTotal;
    } else {
        targetDamage.appliedDamage += damageTotal;
        targetDamage.hpDamage += damageTotal;
        if (targetDamage.oldTempHP > 0) {
            if (targetDamage.oldTempHP >= damageTotal) {
                targetDamage.newTempHP -= damageTotal;
            } else {
                let leftHP = damageTotal - targetDamage.oldTempHP;
                targetDamage.newTempHP = 0;
                targetDamage.newHP -= leftHP;
            }
        } else {
            targetDamage.newHP -= damageTotal;
        }
    }
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let bardicInspiration = {
    'item': item,
    'attack': attack,
    'damage': damage
}