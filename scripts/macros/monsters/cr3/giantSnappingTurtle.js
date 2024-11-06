import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function stable(token) {
    if (!mba.findEffect(token.actor, "Prone")) return;
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Stable", constants.yesNo, "Attempt to roll over from being Prone?");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let saveRoll = await mba.rollRequest(token, "save", "dex");
    if (saveRoll.total < 10) return;
    let effectData = {
        'name': "Movement Penalty",
        'icon': "modules/mba-premades/icons/actions/stand_up.webp",
        'description': `
            <p>You've spent all of your movement to stand up from being @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': 0,
                'priority': 20
            },
        ],
    };
    await mba.removeCondition(token.actor, "Prone");
    await mba.createEffect(token.actor, effectData);
}

export let giantSnappingTurtle = {
    'stable': stable
}