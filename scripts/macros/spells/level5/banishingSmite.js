async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    async function effectMacro() {
        await (warpgate.wait(200));
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.banishingSmite?.targetEffectUuid;
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
                'value': 'function.mbaPremades.macros.banishingSmite.damage,postDamageRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.banishingSmite.post,postActiveEffects',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'banishingSmite': {
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
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = {
        'flags.mba-premades.spell.banishingSmite.targetEffectUuid': effect.uuid
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.banishingSmite);
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'banishingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '5d10[force]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    chrisPremades.queue.remove(workflow.item.uuid);
}

async function post({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.banishingSmite);
    if (!effect) return;
    let targetToken = workflow.targets.first();
    if (targetToken.actor.system.attributes.hp.value <= 50) {
        async function effectMacroCreate() {
            await token.document.update({ hidden: true });
        };
        async function effectMacro() {
            await token.document.update({ hidden: false});
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await chrisPremades.helpers.removeEffect(originEffect);
        }
        let effectData = {
            'name': 'Banishing Smite: Banish',
            'description': "You are banished from the material plane by Banishing Smite. If you are native to a different plane of existence than the material plane, you disappear, returning to your home plane. If you are native to the plane you're on, you vanish into a harmless demiplane. While there, you are incapacitated. You remain there until the spell ends, at which point you reappear in the space you left or in the nearest unoccupied space if that space is occupied.",
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Incapacitated',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onCreate': {
                        'script': chrisPremades.helpers.functionToString(effectMacroCreate)
                    },
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacro)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 5,
                        castLevel: effect.flags['midi-qol'].castData.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };
        let targetEffect = await chrisPremades.helpers.createEffect(targetToken.actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'banishingSmite': {
                            'used': true,
                            'targetEffectUuid': targetEffect.uuid
                        }
                    }
                }
            }
        };
        await chrisPremades.helpers.updateEffect(effect, updates);
    }
}

export let banishingSmite = {
    'damage': damage,
    'item': item,
    'post': post
}