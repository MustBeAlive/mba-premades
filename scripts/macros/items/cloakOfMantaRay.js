import {mba} from "../../helperFunctions.js";

export async function cloakOfMantaRay({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectHood = await mba.findEffect(workflow.actor, "Cloak of Manta Ray: Hood Up");
    if (effectHood) {
        await mba.removeEffect(effectHood);
        return;
    }
    const effectData = {
        'name': "Cloak of Manta Ray: Hood Up",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "While wearing this cloak with its hood up, you can breathe underwater, and you have a swimming speed of 60 feet.",
        'changes': [
            {
                'key': 'system.attributes.movement.swim',
                'mode': 4,
                'value': '60',
                'priority': 50
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
} 