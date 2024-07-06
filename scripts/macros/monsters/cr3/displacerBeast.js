import {mba} from "../../../helperFunctions.js";

async function displacement(token) {
    if (mba.findEffect(token.actor, "Incapacitated")) return;
    if (mba.findEffect(token.actor, "Displacement")) return;
    let effectData = {
        'name': "Displacement",
        'icon': "modules/mba-premades/icons/generic/displacer_beast.webp",
        'description': `
            <p>The displacer beast projects a magical illusion that makes it appear to be standing near its actual location, causing attack rolls against it to have disadvantage.</p>
            <p>If it is hit by an attack, this trait is disrupted until the end of its next turn.</p>
            <p>This trait is also disrupted while the displacer beast is @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} or has a speed of 0.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'macro.tokenMagic',
                'mode': 0,
                'value': "blur",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isDamaged', 'zeroHP']
            }
        }
    };
    await mba.createEffect(token.actor, effectData);
}

export let displacerBeast = {
    'displacement': displacement,
}