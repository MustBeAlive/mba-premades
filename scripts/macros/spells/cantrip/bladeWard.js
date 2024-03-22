async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    const effectData = {
        'name': "Blade Ward",
        'icon': "assets/library/icons/sorted/spells/cantrip/Blade_Ward.webp",
        'description': "Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.chrisPremades.macros.bladeWard.item,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 0,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        }
    }
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.item.type != "weapon") return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let type = workflow.item.system.damage.parts[0][1];
    if (type != "piercing" && type != "slashing" && type != "bludgeoning") return;
    let damageTotal = Math.floor(workflow.damageItem.totalDamage / 2);
    workflow.damageItem.appliedDamage = damageTotal;
    workflow.damageItem.hpDamage = damageTotal;
}

export let bladeWard = {
    'cast': cast,
    'item': item
}