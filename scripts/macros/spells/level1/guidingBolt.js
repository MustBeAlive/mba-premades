//Animation by EskieMoh#2969
export async function guidingBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${target.document.name} Guiding Bolt`, object: token })
    }
    let effectData = {
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
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));

        new Sequence()

            .effect()
            .atLocation(token)
            .file(`jb2a.markers.light.complete.yellow`)
            .scaleToObject(2)
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .belowTokens()
            .fadeOut(2000)
            .duration(5000)
            .zIndex(0)

            .wait(250)

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.evocation.loop.yellow`)
            .scaleToObject(1.25)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens()
            .fadeOut(2000)
            .filter("ColorMatrix", { hue: 5, saturate: 0, brightness: 1.2 })
            .zIndex(0)

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.evocation.loop.yellow`)
            .scaleToObject(1.25)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens(true)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .zIndex(0.1)
            .duration(1200)
            .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
            .fadeOut(300, { ease: "linear" })

            .wait(250)

            .effect()
            .file("jb2a.guiding_bolt.01.yellow")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .scaleIn(0, 500, { ease: "easeOutCubic" })
            .zIndex(2)
            .waitUntilFinished(-2000)

            .play();

        return;
    }
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.markers.light.complete.yellow`)
        .scaleToObject(2)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .fadeOut(2000)
        .duration(5000)
        .zIndex(0)

        .wait(250)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .filter("ColorMatrix", { hue: 5, saturate: 0, brightness: 1.2 })
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(0.1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .wait(250)

        .effect()
        .file("jb2a.guiding_bolt.01.yellow")
        .attachTo(token)
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
        .name(`${target.document.name} Guiding Bolt`)

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
        .name(`${target.document.name} Guiding Bolt`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.particles.outward.orange.02.03")
        .attachTo(target)
        .fadeIn(1000)
        .fadeOut(500)
        .scaleToObject(target.document.texture.scaleX * 1.5)
        .scaleIn(0, 500, { ease: "easeOutCirc" })
        .zIndex(1)
        .filter("ColorMatrix", { hue: -5, saturate: -0.2, brightness: 1.2 })
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} Guiding Bolt`)

        .play();
}