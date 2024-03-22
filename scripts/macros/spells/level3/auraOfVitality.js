// Original macro by CPR
export async function auraOfVitality({speaker, actor, token, character, item, args, scope, workflow}) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Aura of Vitality: Heal Creature', false);
    if (!featureData) return;
    async function effectMacro () {
        await warpgate.revert(token.document, 'Aura of Vitality: Heal Creature');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "You are concentrating on Aura of Vitality. Until the spell ends, you can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.",
        'duration': {
            'seconds': 60
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 3,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
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
        'description': featureData.name,
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}