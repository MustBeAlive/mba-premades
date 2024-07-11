import {mba} from "../../../helperFunctions.js";

export async function mindSliver({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MinSli` })
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
                'specialDuration': ['turnEndSource', 'isSave', 'combatEnd']
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
        .file("animated-spell-effects-cartoon.magic.mind sliver")
        .attachTo(workflow.token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 80 })
        .waitUntilFinished(-1300)

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
        .file("jb2a.template_circle.symbol.normal.stun.purple")
        .attachTo(target)
        .scaleToObject(1.4)
        .delay(200)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} MinSli`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}