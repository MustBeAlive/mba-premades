import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = await canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.markers.bubble.02.complete.green.0")
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scale(0.1)
        .rotate(90)
        .playbackRate(1)
        .duration(5100)
        .fadeOut(1000)
        .spriteOffset({ x: -0.2, y: 0.1 + (workflow.token.document.width - 1) / 2 }, { gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 0 })
        .zIndex(3)

        .effect()
        .file("jb2a.markers.light_orb.complete.green")
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scale(0.25)
        .playbackRate(1.5)
        .duration(5100)
        .scaleOut(0, 2000, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.1 + (workflow.token.document.width - 1) / 2 }, { gridUnits: true })
        .filter("ColorMatrix", { saturate: 0.5, hue: -30 })
        .zIndex(2)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.47")
        .atLocation(workflow.token)
        .rotateTowards(template)
        .delay(1700)
        .scale(0.1)
        .rotate(90)
        .playbackRate(0.5)
        .spriteOffset({ x: -0.4, y: 0 + (workflow.token.document.width - 1) / 2 }, { gridUnits: true })
        .opacity(0.75)
        .tint("#BEE43E")
        .zIndex(2)

        .effect()
        .file("jb2a.breath_weapons.acid.line.green")
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scale(0.5)
        .playbackRate(1.5)
        .spriteOffset({ x: 0.35 + (workflow.token.document.width - 1) / 2 }, { gridUnits: true })
        .zIndex(1)

        .play()

    for (let target of Array.from(workflow.targets)) {
        new Sequence()

            .wait(2200)

            .effect()
            .from(target)
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX)
            .delay(200)
            .duration(2800)
            .fadeIn(200)
            .fadeOut(500)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 50, pingPong: true, gridUnits: true })
            .opacity(0.25)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1 })

            .play()
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} TaCaBr` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are covered in acid.</p>
            <p>You can use your action to scrape or wash the acid off yourself or another creature.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=acid, damageRoll=(${workflow.castData.castLevel * 2})d4, name=Caustic Brew: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["zeroHP"]
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
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.4)
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .effect()
            .delay(100, 1000)
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .fadeIn(500)
            .fadeOut(500)
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.4)
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .effect()
            .delay(100, 1000)
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .fadeIn(500)
            .fadeOut(500)
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.4)
            .opacity(0.8)
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .mask(target)
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .effect()
            .delay(100, 1000)
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.3)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .fadeIn(500)
            .fadeOut(500)
            .zIndex(0.2)
            .persist()
            .name(`${target.document.name} TaCaBr`)

            .play()
    }
}

export let tashaCausticBrew = {
    'cast': cast,
    'item': item
}