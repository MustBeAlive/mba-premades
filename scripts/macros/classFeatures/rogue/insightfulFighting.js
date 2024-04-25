export async function insightfulFighting({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();
    if (chrisPremades.helpers.findEffect(target.actor, 'Incapacitated')) return;
    let sourceRoll = await workflow.actor.rollSkill('ins');
    let targetRoll = await chrisPremades.helpers.rollRequest(target, 'skill', 'dec');
    if (targetRoll.total >= sourceRoll.total) return;
    let effectData = {
        'name': 'Insightful Fighting',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Insight gained on <b>${target.document.name}</b></p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.mba-premades.feature.insightfulFightning.target',
                'mode': 5,
                'value': target.document.uuid,
                'priority': 20
            }
        ]
    };
    let effect = chrisPremades.helpers.findEffect(workflow.actor, 'Insightful Fighting');
    if (effect) await chrisPremades.helpers.removeEffect(effect);
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}