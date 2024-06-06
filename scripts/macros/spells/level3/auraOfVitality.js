import {mba} from "../../../helperFunctions.js";

export async function auraOfVitality({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Aura of Vitality: Heal Creature', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Aura of Vitality: Heal Creature)");
        return;
    }
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Aura of Vitality: Heal Creature');
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are concentrating on Aura of Vitality.</p>
            <p>Until the spell ends, you can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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