import {mba} from "../../../helperFunctions.js";

export async function lance({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.getDistance(workflow.token, workflow.targets.first()) > 5) return;
    let effectData = {
        'name': "Attack: Disadvantage",
        'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
        'description': "You have disadvantage on the next attack you make (target is too close)",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.mwak',
                'value': '1',
                'mode': 5,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['1Attack:mwak']
            },
            'mba-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}