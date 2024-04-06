async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Sunbeam: Create Beam', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Sunbeam: Create Beam');
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
                'key': 'ATL.light.bright',
                'mode': 2,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 60,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectData = {
        'name': 'Save Disdvantage',
        'icon': 'assets/library/icons/sorted/generic/generic_debuff.webp',
        'description': "You have disadvantage on the next save you make",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.all',
                'mode': 5,
                'value': '1',
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isSave']
            },
            'chris-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    let targets = Array.from(workflow.targets);
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        let type = chrisPremades.helpers.raceOrType(target.actor);
        if (type === 'undead' || type === 'ooze') {
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
    }
}

export let sunbeam = {
    'item': item,
    'check': check
}