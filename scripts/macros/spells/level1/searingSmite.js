// Original macro by CPR
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    async function effectMacro() {
        await (warpgate.wait(200));
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.searingSmite?.targetEffectUuid;
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
                'value': 'function.mbaPremades.macros.searingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'searingSmite': {
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
        'flags.mba-premades.spell.searingSmite.targetEffectUuid': effect.uuid
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.searingSmite);
    if (!effect) return;
    if (effect.flags['mba-premades'].spell.searingSmite.used) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'searingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades']?.spell?.searingSmite?.level + 'd6[fire]';
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
        'name': 'Searing Smite: Burn',
        'description': "You are burning. Until the spell ends, you must make a Constitution saving throw at the start of each of your turns. On a failed save, you take 1d6 fire damage. On a successful save, the spell ends. If you or a creature within 5 feet of you uses its action to put out the flames, or if some other effect douses the flames (such as being submerged in water), the spell ends.",
        'icon': effect.icon,
        'origin': effect.uuid,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=start, saveAbility=con, saveDC=' + effect.flags['mba-premades'].spell.searingSmite.dc + ', saveMagic=true, damageRoll=1d6[fire], damageType=fire, name=Searing Smite Burn',
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
                    'searingSmite': {
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

export let searingSmite = {
    'damage': damage,
    'item': item
}