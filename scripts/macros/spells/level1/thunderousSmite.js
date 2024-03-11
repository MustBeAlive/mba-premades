async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.thunderousSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'thunderousSmite': {
                        'dc': chrisPremades.helpersgetSpellDC(workflow.item)
                    }
                }
            }
        }
    };
    await chrisPremades.helperscreateEffect(workflow.actor, effectData);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.thunderousSmite);
    if (!effect) return;
    let targetToken = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'thunderousSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '2d6[thunder]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpersgetCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpersgetItemFromCompendium('mba-premades.MBA Spell Features', 'Thunderous Smite: Push');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.thunderousSmite.dc;
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) {
        await chrisPremades.helperspushToken(workflow.token, targetToken, 10);
        if (!chrisPremades.helperscheckTrait(targetToken.actor, 'ci', 'prone')) await chrisPremades.helpersaddCondition(targetToken.actor, 'Prone');
    }
    await chrisPremades.helpersremoveEffect(effect);
    let conEffect = chrisPremades.helpersfindEffect(workflow.actor, 'Concentrating');
    if (conEffect) await chrisPremades.helpersremoveEffect(conEffect);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let thunderousSmite = {
    'damage': damage,
    'item': item
}