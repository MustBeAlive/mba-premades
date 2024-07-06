import {mba} from "../../../helperFunctions.js";

export async function guidingBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} GuiBol` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "Next attack roll made against you before the end of caster's next turn has advantage.",
        'changes': [
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isHit', 'turnEndSource']
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
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .atLocation(workflow.token)
            .file(`jb2a.markers.light.complete.yellow`)
            .scaleToObject(2)
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .belowTokens()
            .fadeOut(2000)
            .duration(5000)
            .zIndex(0)

            .wait(250)

            .effect()
            .file("jb2a.guiding_bolt.01.yellow")
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scaleIn(0, 500, { ease: "easeOutCubic" })
            .zIndex(2)
            .waitUntilFinished(-2000)

            .play();

        return;
    }
    new Sequence()

        .effect()
        .atLocation(workflow.token)
        .file(`jb2a.markers.light.complete.yellow`)
        .scaleToObject(2)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .fadeOut(2000)
        .duration(5000)
        .zIndex(0)

        .wait(250)

        .effect()
        .file("jb2a.guiding_bolt.01.yellow")
        .attachTo(workflow.token)
        .stretchTo(target, { attachTo: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .zIndex(2)
        .waitUntilFinished(-2000)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal")
        .attachTo(target)
        .fadeIn(250)
        .fadeOut(500)
        .scaleToObject(1.075 * target.document.texture.scaleX)
        .tint(0xfbd328)
        .belowTokens()
        .zIndex(1)
        .persist()
        .name(`${target.document.name} GuiBol`)

        .effect()
        .from(target)
        .atLocation(target)
        .loopProperty("sprite", "position.x", { from: -0.025, to: 0.025, duration: 75, pingPong: true, gridUnits: true })
        .fadeIn(100)
        .fadeOut(400)
        .duration(500)
        .scaleToObject(target.document.texture.scaleX)
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal")
        .attachTo(target)
        .fadeIn(250)
        .fadeOut(500)
        .scaleToObject(target.document.texture.scaleX)
        .tint(0xfbd328)
        .zIndex(1)
        .mask()
        .persist()
        .name(`${target.document.name} GuiBol`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.particles.outward.orange.02.03")
        .attachTo(target)
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .scaleIn(0, 500, { ease: "easeOutCirc" })
        .fadeIn(1000)
        .fadeOut(500)
        .filter("ColorMatrix", { hue: -5, saturate: -0.2, brightness: 1.2 })
        .zIndex(1)
        .randomRotation()
        .mask()
        .persist()
        .name(`${target.document.name} GuiBol`)

        .play();
}