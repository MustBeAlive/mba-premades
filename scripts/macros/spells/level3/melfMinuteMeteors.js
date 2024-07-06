import {mba} from "../../../helperFunctions.js";

//To do: animations, code update

export async function melfMinuteMeteors({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel * 2;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Melf\'s Minute Meteors: Drop Meteor', false);
    if (!featureData) return;
    featureData.system.uses.value = ammount;
    featureData.system.uses.max = ammount;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        warpgate.revert(token.document, 'Melf\'s Minute Meteors: Drop Meteor');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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