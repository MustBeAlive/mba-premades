import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.particles.outward.purple.01.04")
        .atLocation(workflow.token)
        .rotateTowards(template, { cacheLocation: true })
        .scaleToObject(2)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000 })
        .scaleOut(0, 5000, { ease: "easeOutQuint", delay: -3000 })
        .anchor({ x: 0.5 })
        .zIndex(1)
        .filter("ColorMatrix", { hue: 170 })

        .effect()
        .file("jb2a.fireball.beam.dark_green")
        .attachTo(workflow.token)
        .stretchTo(template)
        .delay(300)

        .wait(2500)

        .effect()
        .file("animated-spell-effects-cartoon.water.acid splash.01")
        .attachTo(template)
        .size(10.5, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(2)

        .effect()
        .file("jb2a.fireball.explosion.dark_green")
        .attachTo(template)
        .size(10.5, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(2)

        .effect()
        .file("jb2a.ground_cracks.green.03")
        .attachTo(template)
        .size(10.5, { gridUnits: true })
        .delay(1400)
        .duration(5000)
        .fadeOut(2000)
        .zIndex(0.1)
        .opacity(0.8)
        .randomRotation()
        .belowTokens()
        .persist()

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} VitSph` });
    }
    let effectData = {
        'name': "Vitriolic Sphere: Acid",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>At the end of your next turn, you will take 5d4 acid damage from Vitriolic Sphere's Acid.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, damageType=acid, damageRoll=5d4[acid], name=Vitriolic Sphere: Turn End, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["turnEnd"]
            },
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
    for (let target of Array.from(workflow.failedSaves)) {

        new Sequence()

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .randomRotation()
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} VitSph`)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} VitSph`)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .randomRotation()
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} VitSph`)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} VitSph`)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .randomRotation()
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} VitSph`)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.3)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} VitSph`)

            .play()
    }
}

export let vitriolicSphere = {
    'cast': cast,
    'item': item
}