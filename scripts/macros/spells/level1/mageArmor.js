import {mba} from "../../../helperFunctions.js";

export async function mageArmor({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are surrounded by a protective magical force.</p>
            <p>For the duration, your base AC becomes <b>13 + your dexterity modifier</b>.</p>
            <p>The spell ends if you don armor or if caster dismisses the spell as an action.</p>
        `,
        'duration': {
            'seconds': 28800
        },
        'changes': [
            {
                'key': 'system.attributes.ac.calc',
                'mode': 5,
                'value': 'mage',
                'priority': 50
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.energy_field.01.blue")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .duration(10000)
        .scaleIn(0, 3500, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .playbackRate(0.9)
        .belowTokens()
        .tint("#1fdaff")
        .name(`${target.document.name} Mage Armor`)

        .effect()
        .file("jb2a.energy_field.02.below.blue")
        .attachTo(target)
        .scaleToObject(1.55 * target.document.texture.scaleX)
        .delay(3500)
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(0.9)
        .name(`${target.document.name} Mage Armor`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}