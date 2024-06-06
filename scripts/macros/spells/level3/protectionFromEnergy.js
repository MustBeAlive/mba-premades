import {mba} from "../../../helperFunctions.js";

export async function protectionFromEnergy({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [
        ['Acid', 'Acid', "modules/mba-premades/icons/spells/level3/protection_from_energy_acid.webp"],
        ['Cold', 'Cold', "modules/mba-premades/icons/spells/level3/protection_from_energy_cold.webp"],
        ['Fire', 'Fire', "modules/mba-premades/icons/spells/level3/protection_from_energy_fire.webp"],
        ['Lightning', 'Lightning', "modules/mba-premades/icons/spells/level3/protection_from_energy_lightning.webp"],
        ['Thunder', 'Thunder', "modules/mba-premades/icons/spells/level3/protection_from_energy_thunder.webp"]
    ];
    let selection = await mba.selectImage("Protection from Energy", choices, "Choose element:", "both");
    if (!selection) return;
    const effectData = {
        'name': `Protection from Energy: ${selection[0]}`,
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'description': `You have resistance to ${selection[0].toLowerCase()} damage for the duration.`,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': selection[0].toLowerCase(),
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    }
    await mba.createEffect(target.actor, effectData);
}