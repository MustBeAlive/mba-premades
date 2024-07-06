import {mba} from "../../../helperFunctions.js";

async function naturalArmor(token) {
    let choices = [
        ["None (AC10)", "+0"],
        ["Wood or Bone (AC15)", "+5"],
        ["Earth or Stone (AC17)", "+7"],
        ["Metal (AC19)", "+9"]
    ];
    let selection = await mba.dialog("Zorbo: Natural Armor", choices, "Which material is <u>Zorbo</u> in contact with?");
    if (!selection) return;
    let effect = await mba.findEffect(token.actor, "Natural Armor");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Natural Armor)");
        return;
    }
    let updates = {
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': selection,
                'priority': 20
            },
        ]
    };
    await mba.updateEffect(effect, updates);
}

export let zorbo = {
    'naturalArmor': naturalArmor
}