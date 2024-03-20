async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let hasFearImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'frightened');
    if (!workflow.failedSaves.size) {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    if (hasFearImmunity) {
        ui.notifications.warn("Target is immune to Condition: Feared and is unaffected by Enemies Abound!")
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let effectData = {
        'name': "Enemies Abound",
        'icon': "assets/library/icons/sorted/spells/level3/enemies_abound.webp",
        'description': "You lose the ability to distinguish friend from foe, regarding all creatures you can see as enemies until the spell ends. Each time you take damage, you can repeat the saving throw, ending the effect on a success. Whenever you choose another creature as a target while affected by this spell, you must choose the target at random from among the creatures you can see within range of the attack, spell, or other ability you are using. If an enemy provokes an opportunity attack from you, you must make that attack if you are able to.",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.enemiesAbound.isDamaged,isDamaged',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.enemiesAbound.targetCheck,preItemRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'enemiesAbound': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item)
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}

async function isDamaged({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = chrisPremades.helpers.findEffect(actor, 'Enemies Abound');
    if (!effect) return;
    let spellDC = effect.flags['mba-premades']?.spell?.enemiesAbound?.dc;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'int');
    if (saveRoll.total >= spellDC) {
        await chrisPremades.helpers.removeEffect(effect);
    }
}

async function targetCheck({speaker, actor, token, character, item, args, scope, workflow}) {
    let range = workflow.item.system.range.value;
    if (!range) {
        ui.notifications.warn("Item has no range value. Ask GM for target randomisation (if it can be applied to the used item).");
        return;
    }
    let targetAmmount = workflow.item.system.target.value;
    if (!targetAmmount) {
        ui.notifications.warn("Item has no targets value. Ask GM for target randomisation (if it can be applied to the used item).");
        return;
    }
    let nearbyTargets = await MidiQOL.findNearby(null, token, range, { includeIncapacitated: false, isSeen: true })
    if (targetAmmount >= nearbyTargets.length) {
        console.log("Used item can target more creatures than there are valid targets nearby. Enemies Abound can't affect this item, returning.");
        return;
    }
    let output = mutableSample(nearbyTargets, targetAmmount);
    let newTargets = [];
    for (let i = 0; i < output.length; i++) {
        let token = output[i].document.id;
        newTargets.push(token);
    }
    ui.notifications.warn("You are confused by Enemies Abound and randomly changed target(s)!");
    new Sequence()
        .effect()
        .file("jb2a.dizzy_stars.400px.orange")
        .atLocation(token)
        .anchor(0.5)
        .scaleToObject(2)
        .repeats(3, 1200)

        .play();

    await warpgate.wait(500);
    await chrisPremades.helpers.updateTargets(newTargets);

    function mutableSample (arr, n) { //gets n values from array without shuffling (modifies the array)
        const output = [];
        for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        output.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
        }
        return output;
    }
}

export let enemiesAbound = {
    'item': item,
    'isDamaged': isDamaged,
    'targetCheck': targetCheck
}