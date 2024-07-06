import {mba} from "../../../helperFunctions.js";

export async function mindSpike({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MinSpi` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>${workflow.token.document.name} reached into your mind.</p>
            <p>For the duration, caster of this spell knows your location, but only while the two of you are on the same plane of existence.</p>
            <p>While caster of this spell has this knowledge, you can't become hidden from him and gain no benefit from @UUID[Compendium.mba-premades.MBA SRD.Item.2dEv6KlLgFA4wOni]{Invisible} condition against him.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [ // will work for anyone, but there is no other option (for now)
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': "invisible",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.ranged.03.projectile.01.pinkpurple")
        .attachTo(workflow.token)
        .stretchTo(target)
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.melee_generic.slashing.two_handed")
        .attachTo(target)
        .scaleToObject(2)
        .spriteRotation(90)
        .filter("ColorMatrix", { hue: 240 })

        .effect()
        .file("jb2a.impact.004.dark_purple")
        .attachTo(target)
        .scaleToObject(1.7)
        .delay(400)
        .fadeOut(1000)
        .playbackRate(0.8)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .effect()
        .file("jb2a.token_border.circle.spinning.purple.003")
        .attachTo(target)
        .scaleToObject(1.8)
        .delay(200)
        .fadeIn(500)
        .fadeOut(1000)
        .belowTokens()
        .persist()
        .name(`${target.document.name} MinSpi`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}