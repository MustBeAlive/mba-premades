// Original macro by CPR
export async function auraOfVitality({speaker, actor, token, character, item, args, scope, workflow}) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Aura of Vitality: Heal Creature', false);
    if (!featureData) return;
    async function effectMacro () {
        await warpgate.revert(token.document, 'Aura of Vitality: Heal Creature');
    }
    let effectData = {
        'name': "Aura of Vitality",
        'icon': workflow.item.img,
        'description': "",
        'duration': {
            'seconds': 60
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
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
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': effectData.name,
        'description': featureData.name,
        'origin': workflow.item.uuid
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}