import { mba } from "../../../helperFunctions.js";

export async function spareTheDying({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.document.uuid === token.document.uuid) {
        ui.notifications.warn('Wrong target selected!');
        return;
    }
    if (target.actor.system.attributes.hp.value > 0) {
        ui.notifications.warn('Target is alive!');
        return;
    }
    let type = mba.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Spare the Dying has no effect on undead or constructs!');
        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Spare the Dying` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': 'You are stable and no longer have to make death saving throws',
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'system.attributes.death.success',
                'mode': 5,
                'value': 3,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isHealed', 'shortRest', 'longRest', 'isDamaged'],
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
        .file("jb2a.cast_shape.circle.01.green")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.cast_shape.circle.single01.green")
        .delay(800)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)

        .effect()
        .attachTo(target, { locale: true })
        .from(target)
        .delay(1200)
        .belowTokens()
        .scaleToObject(1, { considerTokenScale: true })
        .spriteRotation(target.rotation * -1)
        .filter("Glow", { color: 0x30d57f, distance: 20 })
        .opacity(0.8)
        .zIndex(0.1)
        .fadeOut(1000)
        .loopProperty("alphaFilter", "alpha", { values: [0.05, 0.75], duration: 5000, pingPong: true })
        .persist()
        .name(`${target.document.name} Spare the Dying`)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal")
        .attachTo(target)
        .delay(1200)
        .scaleToObject(1 * target.document.texture.scaleX)
        .tint("#30d57f")
        .belowTokens()
        .playbackRate(0.66)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} Spare the Dying`)

        .wait(800)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()
}