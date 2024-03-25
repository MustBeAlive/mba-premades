async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let targetActor = workflow.targets.first().actor;
    const armorKeywords = ["Breastplate", "Chain Mail", "Chain Shirt", "Half Plate", "Plate", "Plate Armor", "Ring Mail", "Scale Mail", "Spiked Armor", "Splint"]; // does partial match
    let hasMatchingArmor = targetActor.items.some(item => armorKeywords.some(keyword => item.name.includes(keyword)));
    if (!hasMatchingArmor) return;
    const effectData = {
        'name': "Shocking Grasp: Metal Armor Advantage",
        'icon': workflow.item.img,
        'description': "You have advantage on Shocking Grasp melee spell attack since the target is wearing armor made of metal.",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': "flags.midi-qol.advantage.attack.msak", 
                'mode': 3, 
                'value': "1", 
                'priority': 20
            }
        ]
    };
    await chrisPremades.helpers.createEffect(actor, effectData)
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let advEffect = chrisPremades.helpers.findEffect(workflow.actor, "Shocking Grasp: Metal Armor Advantage");
    if (advEffect) {
        await chrisPremades.helpers.removeEffect(advEffect);
    }
    if (!workflow.hitTargets.size) return;
    let targetActor = workflow.targets.first().actor;
    let effect = chrisPremades.helpers.findEffect(targetActor, 'Reaction');
    if (!effect) chrisPremades.helpers.addCondition(targetActor, 'Reaction', false, workflow.item.uuid);
}

export let shockingGrasp = {
    'cast': cast,
    'item': item
}