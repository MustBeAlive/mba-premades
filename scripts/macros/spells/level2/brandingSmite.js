// Based on CPR Searing/Thunderous Smite
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    async function effectMacro() {
        await (warpgate.wait(200));
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.brandingSmite?.targetEffectUuid;
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
                'value': 'function.mbaPremades.macros.brandingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'brandingSmite': {
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
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        }
    };
    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = {
        'flags.mba-premades.spell.brandingSmite.targetEffectUuid': effect.uuid
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.brandingSmite);
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'brandingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades']?.spell?.brandingSmite?.level + 'd6[radiant]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    async function effectMacro() {
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await chrisPremades.helpers.removeEffect(originEffect);
    }
    let effectData = {
        'name': 'Branding Smite: Brand',
        'icon': effect.icon,
        'description': "You are branded by Branding Smite. Until the spell ends, you can't become invisible and shed dim light in a 5-foot radius.",
        'origin': effect.uuid,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': 'invisible',
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '5',
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
                    baseLevel: 2,
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
                    'brandingSmite': {
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

export let brandingSmite = {
    'damage': damage,
    'item': item
}