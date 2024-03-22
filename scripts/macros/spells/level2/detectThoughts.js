// Reworked; Original macro by CPR
async function detectThoughtsItem({speaker, actor, token, character, item, args, scope, workflow}) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Thoughts: Probe Mind', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    async function effectMacro () {
        await warpgate.revert(token.document, 'Detect Thoughts: Probe Mind');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
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
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
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

async function detectThoughtsProbeItem({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size === 1) return;
    await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
}

async function detectThoughtsProbeOnCast({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let targetIntValue = target.actor.system.abilities.int.value;
    if (targetIntValue <= 3) {
        ui.notifications.warn('Detect Thoughts can only affect creatures with Intelligence score of 4 or higher!');
        return false;
    }
    let languages = target.actor.system.traits.languages.value;
    if (languages.size < 1) {
        ui.notifications.warn('Detect Thoughts can only affect creatures that know at least one language!');
        return false;   
    }
}

export let detectThoughts = {
    'item': detectThoughtsItem,
    'probeItem': detectThoughtsProbeItem,
    'probeOnCast': detectThoughtsProbeOnCast
}