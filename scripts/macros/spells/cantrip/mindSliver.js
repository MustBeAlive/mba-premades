import { mba } from "../../../helperFunctions.js";

export async function mindSliver({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Mind Sliver`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You subtract 1d4 from the next saving throw you make.</p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': "-1d4",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource', 'isSave']
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
        .file("jb2a.ranged.03.projectile.01.pinkpurple")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.impact.004.dark_purple")
        .attachTo(target)
        .delay(200)
        .scaleToObject(1.7)
        .playbackRate(0.8)
        .fadeOut(1000)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .effect()
        .file("jb2a.template_square.symbol.normal.stun.purple")
        .delay(200)
        .attachTo(target)
        .scaleToObject(1)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} Mind Sliver`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(function () {
            if (workflow.failedSaves.size) mba.createEffect(target.actor, effectData);
        })

        .play()
}