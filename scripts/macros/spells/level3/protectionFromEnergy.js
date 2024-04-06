export async function protectionFromEnergy({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [
        ['Acid 🧪', 'acid'],
        ['Cold ❄️', 'cold'],
        ['Fire 🔥', 'fire'],
        ['Lightning ⚡', 'lightning'],
        ['Thunder ☁️', 'thunder']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose damage type:', choices);
    if (!selection) return;
    let name;
    let icon;
    switch (selection) {
        case 'acid': {
            name = "Protection from Energy: Acid";
            icon = "assets/library/icons/sorted/spells/level3/protection_from_energy_acid.webp";
            break;
        }
        case 'cold': {
            name = "Protection from Energy: Cold";
            icon = "assets/library/icons/sorted/spells/level3/protection_from_energy_cold.webp";
            break;
        }
        case 'fire': {
            name = "Protection from Energy: Fire";
            icon = "assets/library/icons/sorted/spells/level3/protection_from_energy_fire.webp";
            break;
        }
        case 'lightning': {
            name = "Protection from Energy: Lightning";
            icon = "assets/library/icons/sorted/spells/level3/protection_from_energy_lightning.webp";
            break;
        }
        case 'thunder': {
            name = "Protection from Energy: Thunder";
            icon = "assets/library/icons/sorted/spells/level3/protection_from_energy_thunder.webp";
            break;
        }
    }
    const effectData = {
        'name': name,
        'icon': icon,
        'origin': workflow.item.uuid,
        'description': "You have resistance to " + selection + " damage.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': selection,
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
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}