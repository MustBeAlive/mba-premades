import {mba} from "../../../helperFunctions.js";

async function poi24({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Couatl: Poison")) return;
    const effectData = {
        'name': "Couatl: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are poisoned by Couatl and are Unconscious for the duration, or until another creature uses an action to shake you awake.</p>
        `,
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            }
        ]
    };
    await mba.createEffect(target.actor, effectData);
    await mba.addCondition(target.actor, "Unconscious");
    let effect = await mba.findEffect(target.actor, "Unconscious");
    if (!effect) return;
    let updates = {
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged']
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

export let couatl = {
    'poi24': poi24
}