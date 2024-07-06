import {mba} from "../../../helperFunctions.js";

export async function resistance({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Resist` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you have 1d4 bonus to the next ability save roll you make.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isSave']
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

        .wait(500)

        .effect()
        .file("jb2a.swirling_sparkles.01.yellow")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.portals.horizontal.ring_masked.yellow")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} Resist`)

        .thenDo(async () => {
            let effect = await mba.findEffect(target.actor, "Resistance");
            if (effect) await mba.removeEffect(effect); //HB, target cannot benefit from more than 1 instance of "Resistance"
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}