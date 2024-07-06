import {mba} from "../../../helperFunctions.js";

export async function longLimbed(origin, actor) {
    let effectData = {
        'name': origin.name,
        'icon': origin.img,
        'origin': origin.uuid,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.range.mwak',
                'mode': 2,
                'value': '+5',
                'priority': 20
            }
        ]
    };
    await mba.createEffect(actor, effectData);
    //await origin.displayCard();
}