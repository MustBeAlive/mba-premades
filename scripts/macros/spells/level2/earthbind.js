import {mba} from "../../../helperFunctions.js";

export async function earthbind({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroEveryRound() {
        let currentElevation = token.document.elevation;
        if (currentElevation === 0) return;
        let newElevation;
        if (currentElevation > 0 && currentElevation > 60) {
            newElevation = currentElevation - 60;
        }
        if (currentElevation > 0 && currentElevation < 60) {
            newElevation = 0;
        }
        new Sequence()

            .effect()
            .file("jb2a.zoning.directional.once.redyellow.line400.02")
            .attachTo(token)
            .scaleToObject(1.4)
            .spriteRotation(90)
            .waitUntilFinished(-3000)

            .thenDo(async () => {
                await token.document.update({ "elevation": newElevation });
            })

            .play()
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Earthb` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your flying speed (if you have one) is reduced to 0 for the duration.</p>
            <p>Additionally, if you are airborne, you safely descend at 60 feet per round until you reach the ground or the spell ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.fly',
                'mode': 3,
                'value': 0,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onRoundEnd': {
                    'script': mba.functionToString(effectMacroEveryRound)
                },
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
        .file("jb2a.energy_strands.in.yellow.01.2")
        .attachTo(target)
        .scaleToObject(1.4)

        .effect()
        .file("jb2a.zoning.directional.once.redyellow.line400.02")
        .attachTo(target)
        .scaleToObject(1.5)
        .spriteRotation(90)
        .waitUntilFinished(-2200)

        .effect()
        .file("jb2a.energy_wall.01.circle.500x500.01.complete.orange")
        .attachTo(target)
        .scaleToObject(1.4)
        .fadeOut(500)
        .belowTokens()
        .persist()
        .name(`${target.document.name} Earthb`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}