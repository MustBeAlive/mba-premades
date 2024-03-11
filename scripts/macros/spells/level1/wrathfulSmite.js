// Based on CPR Searing/Thunderous Smite
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    async function effectMacro() {
        await (warpgate.wait(200));
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.wrathfulSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        await chrisPremades.helpers.removeEffect(targetEffect);
    }
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
                'value': 'function.chrisPremades.macros.wrathfulSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'wrathfulSmite': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                        'level': workflow.castData.castLevel,
                        'used': false
                    }
                }
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            }
        }
    };
    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = {
        'flags.mba-premades.spell.wrathfulSmite.targetEffectUuid': effect.uuid
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.wrathfulSmite);
    if (!effect) return;
    let targetToken = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'wrathfulSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d6[psychic]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Wrathful Smite: Fear');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.wrathfulSmite.dc;
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    if (featureWorkflow.failedSaves.size) {
        async function effectMacro() {
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await chrisPremades.helpers.removeEffect(originEffect);
        }
        let effectData = {
            'name': 'Wrathful Smite: Fear',
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'actionSave=true, rollType=check, saveAbility=wis, saveDC=' + effect.flags['mba-premades'].spell.wrathfulSmite.dc + ' , saveMagic=true, name=Wrathful Smite',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Frightened',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacro)
                    }
                }
            }
        };
        let targetEffect = await chrisPremades.helpers.createEffect(workflow.targets.first().actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'wrathfulSmite': {
                            'used': true,
                            'targetEffectUuid': targetEffect.uuid
                        }
                    }
                }
            }
        };
        await chrisPremades.helpers.updateEffect(effect, updates);
        chrisPremades.queue.remove(workflow.item.uuid);
    }
}

export let wrathfulSmite = {
    'damage': damage,
    'item': item
}