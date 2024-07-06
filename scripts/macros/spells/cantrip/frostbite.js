import {mba} from "../../../helperFunctions.js";

export async function frostbite({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Frostbite` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have disadvantage on the next weapon attack roll you makes before the end of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.mwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.rwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd', '1Attack:mwak', '1Attack:rwak']
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

        .effect()
        .file("jb2a.spell_projectile.ice_shard.blue")
        .attachTo(workflow.token)
        .stretchTo(target)
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.impact.ground_crack.frost.01.blue")
        .attachTo(target)
        .scaleToObject(1.3)
        .fadeIn(500)
        .endTime(3400)
        .fadeOut(1000)
        .opacity(0.2)
        .mask()
        .persist()
        .noLoop()
        .name(`${target.document.name} Frostbite`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}