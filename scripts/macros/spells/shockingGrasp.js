export async function shockingGrasp({speaker, actor, token, character, item, args, scope, workflow}) {
    Hooks.once("midi-qol.preambleComplete", (workflow) => {
        const targetActor = workflow.targets.first().actor;
        const armorKeywords = ["Breastplate", "Chain Mail", "Chain Shirt", "Half Plate", "Plate", "Plate Armor", "Ring Mail", "Scale Mail", "Spiked Armor", "Splint"]; // does partial match
        let hasMatchingArmor = targetActor.items.some(item => armorKeywords.some(keyword => item.name.includes(keyword)));
        if (hasMatchingArmor) {
            const effectData = {
                'name': "Shocking Grasp: Metal Armor Advantage",
                'icon': "assets/library/icons/sorted/spells/cantrip/shocking_grasp.webp",
                'description': "You have advantage on Shocking Grasp melee spell attack if the target is wearing armor made of metal.",
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
            chrisPremades.helpers.createEffect(actor, effectData)
        }
    });
    Hooks.once("midi-qol.AttackRollComplete", (workflow) => {
        if (workflow.hitTargets.size != 1) {
            actor.effects.getName('Shocking Grasp: Metal Armor Advantage')?.delete();
        }
    });
    Hooks.once("midi-qol.RollComplete", (workflow) => {
        const targetActor = workflow.targets.first().actor;
        let hasAdvantage = chrisPremades.helpers.findEffect(workflow.actor, 'Shocking Grasp: Metal Armor Advantage');
        if (hasAdvantage) {
            actor.effects.getName('Shocking Grasp: Metal Armor Advantage')?.delete();
        }
        let effect = chrisPremades.helpers.findEffect(targetActor, 'Reaction');
        if (!effect) chrisPremades.helpers.addCondition(targetActor, 'Reaction', false, workflow.item.uuid);
    });
}