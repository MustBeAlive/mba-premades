import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const armorKeywords = ["Breastplate", "Chain Mail", "Chain Shirt", "Half Plate", "Plate", "Plate Armor", "Ring Mail", "Scale Mail", "Spiked Armor", "Splint"]; // does partial match
    let hasMatchingArmor = target.actor.items.some(item => armorKeywords.some(keyword => item.name.includes(keyword)));
    if (!hasMatchingArmor) return;
    const effectData = {
        'name': "Shocking Grasp: Metal Armor Advantage",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
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
    await mba.createEffect(actor, effectData)
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, "Shocking Grasp: Metal Armor Advantage");
    if (effect) await mba.removeEffect(effect);
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.chain_lightning.secondary.blue")
        .attachTo(token)
        .stretchTo(target)
        .missed(workflow.hitTargets.size === 0)

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .delay(300)
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .repeats(2, 2500)
        .playIf(() => {
            return workflow.hitTargets.size != 0
        })

        .play()

    if (!workflow.hitTargets.size) return;
    let reaction = mba.findEffect(target.actor, 'Reaction');
    if (!reaction) mba.addCondition(target.actor, 'Reaction', false, workflow.item.uuid);

}

export let shockingGrasp = {
    'cast': cast,
    'item': item
}