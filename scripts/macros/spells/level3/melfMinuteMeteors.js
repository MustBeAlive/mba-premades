export async function melfMinuteMeteors({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel * 2;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Melf\'s Minute Meteors: Drop Meteor', false);
    if (!featureData) return;
    featureData.system.uses.value = ammount;
    featureData.system.uses.max = ammount;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Melf\'s Minute Meteors: Drop Meteor');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'duration': {
            'seconds': 600
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
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