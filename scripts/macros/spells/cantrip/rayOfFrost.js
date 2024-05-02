import {mba} from "../../../helperFunctions.js";

export async function rayOfFrost({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
        
        new Sequence()

            .effect()
            .file("jb2a.ray_of_frost.blue")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .repeats(4, 500)

            .play()

        return;
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Ray of Frost`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your speed is reduced by 10 feet until the start of the caster's next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.movement.walk',
                'mode': 2,
                'value': '-10',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
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
        .file("jb2a.ray_of_frost.blue")
        .attachTo(token)
        .stretchTo(target)
        .repeats(4, 500)
        .waitUntilFinished(-3000)

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
        .name(`${target.document.name} Ray of Frost`)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()
}