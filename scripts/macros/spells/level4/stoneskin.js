import {mba} from "../../../helperFunctions.js";

export async function stoneskin({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} StoSki` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you have resistance to nonmagical bludgeoning, piercing and slashing damage.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.custom',
                'mode': 0,
                'value': "Non-Magical Physical",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield_themed.above.molten_earth.01.dark_orange")
        .attachTo(target)
        .scaleToObject(1.6)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(0.85)
        .persist()
        .name(`${target.document.name} StoSki`)

        .effect()
        .file("jb2a.shield_themed.below.molten_earth.01.dark_orange")
        .attachTo(target)
        .scaleToObject(1.6)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .persist()
        .name(`${target.document.name} StoSki`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}