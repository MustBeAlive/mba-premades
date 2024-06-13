import {mba} from "../../../helperFunctions.js";

async function poi5({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Drow: Poison")) return;
    let saveResult = workflow.saveResults[0].total;
    let saveDC = workflow.item.system.save.dc;
    const effectData = {
        'name': "Drow: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 3600
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
    if (saveResult + 5 <= saveDC) { // this whole block is just cringe
        if (mba.findEffect(target.actor, "Unconscious")) return;
        await mba.addCondition(target.actor, "Unconscious");
        let effect1 = await mba.findEffect(target.actor, "Unconscious");
        let effect2 = await mba.findEffect(target.actor, "Drow: Poison");
        let updates1 = {
            'flags': {
                'dae': {
                    'specialDuration': ['isDamaged']
                }
            }
        };
        let updates2 = {
            'description': `
                <p>You failed save againt Drow Poison by 5 or more, and become unconscious for the duration.</p>
                <p>You will wake up from this slumber if you take damage or another creature uses an action to shake you awake (don't tell anyone).</p>
            `
        }
        await mba.updateEffect(effect1, updates1);
        await mba.updateEffect(effect2, updates2);
    }
}

export let drow = {
    'poi5': poi5
}