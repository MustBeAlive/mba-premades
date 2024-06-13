async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Fizban\'s Platinum Shield: Apply Shield', false);
    if (!featureData) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Fizban\'s Platinum Shield: Apply Shield');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mbaPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': featureData.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = mbaPremades.helpers.findEffect(workflow.actor, "Fizban's Platinum Shield");
    let effectData = {
        'name': "Platinum Shield",
        'icon': workflow.item.img,
        'description': "<p>You are surrounded by a field of silvery light. For the duration, you gain the following benefits:</p><p>You have half cover</p><p>You have resistance to acid, cold, fire, lightning and poison damage</p><p>If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail.</p>",
        'origin': effect.flags['midi-qol']?.castData?.itemUuid,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 5,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Cover (Half)",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "acid",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "cold",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "fire",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "lightning",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "poison",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.superSaver.dex',
                'mode': 5,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let target = workflow.targets.first();
    let oldTargetEffectUuid = effect.flags['mba-premades']?.spell?.fizbanPlatinumShield?.targetEffectUuid;
    if (!oldTargetEffectUuid) {
        let targetEffect = await mbaPremades.helpers.createEffect(target.actor, effectData);
        let newEffect = await mbaPremades.helpers.findEffect(target.actor, "Platinum Shield");
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'fizbanPlatinumShield': {
                            'targetEffectUuid': targetEffect.uuid,
                        }
                    }
                }
            }
        }
        await mbaPremades.helpers.updateEffect(effect, updates)
        return;
    }
    let oldTargetEffect = await fromUuid(oldTargetEffectUuid);
    await mbaPremades.helpers.removeEffect(oldTargetEffect);
    let targetEffect = await mbaPremades.helpers.createEffect(target.actor, effectData);
    let newEffect = await mbaPremades.helpers.findEffect(target.actor, "Platinum Shield");
    let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
    concData.push(newEffect.uuid);
    await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'fizbanPlatinumShield': {
                        'targetEffectUuid': targetEffect.uuid,
                    }
                }
            }
        }
    }
    await mbaPremades.helpers.updateEffect(effect, updates)
}

export let fizbanPlatinumShield = {
    'cast': cast,
    'item': item
}