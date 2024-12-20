import {mba} from "../../helperFunctions.js";

let effectData = {
    'name': 'Condition Advantage',
    'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
    'changes': [
        {
            'key': 'flags.midi-qol.advantage.ability.save.all',
            'value': '1',
            'mode': 5,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'showIcon': true
        },
    }
};
let cleanUpList = [];

export async function conditionResistanceEarly(workflow) {
    if (!workflow.targets.size) return;
    if (workflow.item.system.save?.dc === null || workflow.item.system.save === undefined) return;
    if (!workflow.item.effects.size) return;
    let itemConditions = new Set();
    workflow.item.effects.forEach(effect => {
        effect.changes.forEach(element => {
            if (element.key === 'macro.CE') itemConditions.add(element.value.toLowerCase());
        });
    });
    if (!itemConditions.size) return;
    await Promise.all(workflow.targets.map(async tokenDoc => {
        await Promise.all(itemConditions.map(async condition => {
            if (tokenDoc.document.actor.flags['mba-premades']?.CR?.[condition]) {
                await mba.createEffect(tokenDoc.document.actor, effectData);
                cleanUpList.push(tokenDoc.document.actor);
            }
        }));
    }));
}

export async function conditionResistanceLate(workflow) {
    for (let i of cleanUpList) {
        let effect = mba.findEffect(i, 'Condition Advantage');
        if (effect) await mba.removeEffect(effect);
    }
    cleanUpList = [];
}