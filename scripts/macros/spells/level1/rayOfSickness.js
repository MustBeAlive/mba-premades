import {mba} from "../../../helperFunctions.js";

export async function rayOfSickness({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RaOfSi` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} until the end of the caster's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
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

        .effect()
        .file("jb2a.scorching_ray.01.green")
        .attachTo(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .delay(1000)
        .fadeIn(500)
        .fadeOut(1500)
        .mask()
        .persist()
        .name(`${target.document.name} RaOfSi`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}