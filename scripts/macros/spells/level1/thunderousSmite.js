async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = chrisPremades.helpers.getEffects(workflow.actor).find(i => i.flags['chris-premades']?.spell?.thunderousSmite);
    if (!effect) return;
    let targetToken = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'thunderousSmite', 250);
    if (!queueSetup) return;
    let bonusDamageFormula = '2d6[thunder]';
    await chrisPremades.helpers.addToDamageRoll(workflow, bonusDamageFormula);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Thunderous Smite: Push');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['chris-premades'].spell.thunderousSmite.dc;
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) {
        await chrisPremades.helpers.pushToken(workflow.token, targetToken, 10);
        if (!chrisPremades.helpers.checkTrait(targetToken.actor, 'ci', 'prone')) await chrisPremades.helpers.addCondition(targetToken.actor, 'Prone');
    }
    await chrisPremades.helpers.removeEffect(effect);
    let conEffect = chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    if (conEffect) await chrisPremades.helpers.removeEffect(conEffect);
    chrisPremades.queue.remove(workflow.item.uuid);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let effectData = {
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'name': workflow.item.name,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.chrisPremades.macros.thunderousSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'chris-premades': {
                'spell': {
                    'thunderousSmite': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item)
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

export let thunderousSmite = {
    'damage': damage,
    'item': item
}