import {mba} from "../../../helperFunctions.js";

export function svirfneblinCamouflage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on the next Stealth check you make.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.skill.ste',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isSkill.ste'],
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.sneak_attack.yellow")
        .atLocation(workflow.token)
        .scaleToObject(2.5)

        .wait(200)
        
        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}