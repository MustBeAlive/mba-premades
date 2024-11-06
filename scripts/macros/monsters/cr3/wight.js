import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";

// To do: zombie if dead

async function lifeDrain({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .play()

    if (!workflow.failedSaves.size) return;
    if (mba.findEffect(target.actor, "Aura of Life")) return;
    let damageRoll = workflow.damageRoll.total;
    let effect = await mba.findEffect(target.actor, "Wight: Life Drain");
    if (effect) {
        let originalMax = effect.flags['mba-premades']?.originalMax;
        let newPenalty = effect.flags['mba-premades']?.penalty + damageRoll;
        let updates = {
            'description': `
                <p>Your hit point maximum (<b>${originalMax}</b>) is reduced by (<b>${newPenalty}</b>).</p>
                <p>You will die if this effect reduces your hit point maximum to 0.</p>
            `,
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['longRest']
                },
                'mba-premades': {
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mba.updateEffect(effect, updates);
        return;
    }
    const effectData = {
        'name': "Wight: Life Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your hit point maximum (<b>${target.actor.system.attributes.hp.max}</b>) is reduced by (<b>${damageRoll}</b>).</p>
            <p>You will die if this effect reduces your hit point maximum to 0.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.hp.max',
                'mode': 2,
                'value': `-${damageRoll}`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['longRest']
            },
            'mba-premades': {
                'greaterRestoration': true,
                'healthReduction': true,
                'originalMax': target.actor.system.attributes.hp.max,
                'penalty': damageRoll,
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let wight = {
    'lifeDrain': lifeDrain
}