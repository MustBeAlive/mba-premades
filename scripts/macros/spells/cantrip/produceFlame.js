export async function produceFlame({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.token) return;
    let level = workflow.actor.system.details.level ?? workflow.actor.system.details.cr;
    let dice = 1 + (Math.floor((level + 1) / 6));
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Produce Flame: Hurl', false);
    if (!featureData) return;
    featureData.system.damage.parts[0][0] = dice + 'd8[fire]';
    async function effectMacro () {
        await warpgate.revert(token.document, 'Produce Flame: Hurl');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'duration': {
            'seconds': 600
        },
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '20',
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 4,
                'value': '{intensity: 1, reverse: false, speed: 6, type: "torch"}',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
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
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Produce Flame: Hurl',
        'description': 'Produce Flame: Hurl'
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}