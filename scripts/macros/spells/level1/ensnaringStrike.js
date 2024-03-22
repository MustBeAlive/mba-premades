// Based on CPR Searing/Thunderous Smite
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    async function effectMacro() {
        await (warpgate.wait(200));
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.ensnaringStrike?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        await chrisPremades.helpers.removeEffect(targetEffect);
    }
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
                'value': 'function.mbaPremades.macros.ensnaringStrike.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'ensnaringStrike': {
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
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = {
        'flags.mba-premades.spell.ensnaringStrike.targetEffectUuid': effect.uuid
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.ensnaringStrike);
    if (!effect) {
        ui.notifications.warn('Missing flag!');
        return;
    }
    if (effect.flags['mba-premades'].spell.ensnaringStrike.used) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'ensnaringStrike', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades'].spell.ensnaringStrike.level + 'd6[piercing]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Ensnaring Strike: Thorny Vines');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.ensnaringStrike.dc;
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
            'name': 'Ensnaring Strike: Thorny Vines',
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'actionSave=true, saveAbility=str, saveDC=' + effect.flags['mba-premades'].spell.ensnaringStrike.dc + ' , saveMagic=true, name=Thorny Vines',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=start, damageBeforeSave=true, damageRoll=' + effect.flags['mba-premades'].spell.ensnaringStrike.level + 'd6[piercing] , damageType=piercing, name=Thorny Vines',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Restrained',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacro)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 1,
                        castLevel: effect.flags['midi-qol'].castData.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };
        let targetEffect = await chrisPremades.helpers.createEffect(workflow.targets.first().actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'ensnaringStrike': {
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

export let ensnaringStrike = {
    'damage': damage,
    'item': item
}