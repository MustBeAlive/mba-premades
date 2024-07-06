import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let talismanEffect = await mba.findEffect(workflow.actor, "Pact of the Talisman");
    if (!talismanEffect) return;
    let oldTalisman = talismanEffect.flags['mba-premades']?.feature?.pactOfTheTalisman?.created;
    if (oldTalisman) {
        let targetTokenId = talismanEffect.flags['mba-premades']?.feature?.pactOfTheTalisman?.targetId;
        let targetDoc = canvas.scene.tokens.get(targetTokenId);
        if (!targetDoc) return;
        await warpgate.revert(targetDoc, 'Eldritch Talisman');
    }
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', "Eldritch Talisman", false);
    if (!featureData) return;
    let changes = featureData.effects[0].changes;
    featureData.system.uses.value = workflow.actor.system.attributes.prof;
    featureData.system.uses.max = workflow.actor.system.attributes.prof;
    if (mba.getItem(workflow.actor, "Protection of the Talisman")) changes = changes.concat(
        {
            'key': 'flags.midi-qol.optional.pactOfTheTalisman.save.all',
            'mode': 5,
            'value': "1d4",
            'priority': 20
        }
    )
    featureData.effects[0].changes = changes;
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
        }
    };
    let options = {
        'permanent': false,
        'name': 'Eldritch Talisman',
        'description': 'Eldritch Talisman'
    };
    await warpgate.mutate(target.document, updates, {}, options);
    let updates2 = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'pactOfTheTalisman': {
                        'created': true,
                        'targetId': target.id
                    }
                }
            }
        }
    };
    await mba.updateEffect(talismanEffect, updates2)
}

export let pactOfTheTalisman = {
    'item': item
}