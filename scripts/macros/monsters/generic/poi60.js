import {mba} from "../../../helperFunctions.js";

export async function poi60({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 0) return;
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Poison`)) return;;
    let effectData = {
        'name': `${workflow.token.document.name}: Poison`,
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You've been poisoned by ${workflow.token.document.name}.</p>
            <p>You are stable, but poisoned for the duration (even after regaining hit points) and are Paralyzed while poioned in this way.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Paralyzed",
                'priority': 20
            },
            {
                'key': 'system.attributes.death.success',
                'mode': 5,
                'value': 3,
                'priority': 20
            }
        ]
    };
    await mba.createEffect(target.actor, effectData);
}