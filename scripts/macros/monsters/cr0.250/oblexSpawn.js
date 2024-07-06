import {mba} from "../../../helperFunctions.js";

async function aversionToFire({ speaker, actor, token, character, item, args, scope, workflow }) {
    let aversionEffect = await mba.findEffect(actor, "Aversion to Fire");
    if (!aversionEffect) return;
    let aversionDebuff = await mba.findEffect(actor, "Oblex Spawn: Aversion to Fire");
    if (aversionDebuff) return;
    let typeCheck = workflow.damageDetail?.some(i => i.type === "fire");
    if (!typeCheck) return;
    const effectData = {
        'name': "Oblex Spawn: Aversion to Fire",
        'icon': "modules/mba-premades/icons/generic/generic_fire.webp",
        'description': `
            <p>${actor.prototypeToken.name} recieved fire damage and has disadvantage on attack rolls and ability checks until the end of its next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await mba.createEffect(actor, effectData);
}

export let oblexSpawn = {
    'aversionToFire': aversionToFire
}