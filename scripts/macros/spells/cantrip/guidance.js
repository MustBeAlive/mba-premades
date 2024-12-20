import {mba} from "../../../helperFunctions.js";

export async function guidance({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(target.actor, "Guidance");
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Guidance` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you have 1d4 bonus to the next ability check roll you make.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.abilities.check',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isCheck', 'isSkill']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(250)

        .effect()
        .file("jb2a.swirling_leaves.outburst.01.bluepurple")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeOut(1000)

        .wait(250)

        .effect()
        .file("jb2a.portals.horizontal.ring_masked.blue")
        .attachTo(target)
        .scaleToObject(1.75 * target.document.texture.scaleX)
        .fadeIn(1500)
        .fadeOut(1500)
        .mask()
        .persist()
        .name(`${target.document.name} Guidance`)

        .thenDo(async () => {
            if (effect) await mba.removeEffect(effect); //HB, target cannot benefit from more than 1 instance of "Guidance"
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}