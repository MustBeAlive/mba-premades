//Animation by EskieMoh#2969
async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.loop.green`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_green`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.95)
        .fadeOut(500)
        .size(4.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 0.75,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .persist()
        .zIndex(1.5)
        .name(`Entangle`)
        .private()

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.85)
        .fadeOut(500)
        .size(4.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 1.55,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .persist()
        .zIndex(1.3)
        .name(`Entangle`)
        .private()

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.75)
        .fadeOut(500)
        .size(4.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 2.05,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .persist()
        .zIndex(1.2)
        .name(`Entangle`)
        .private()

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(5.6, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)
        .name(`Entangle`)
        .private()

        .effect()
        .atLocation(template)
        .file(`jb2a.fireflies.many.01.green`)
        .delay(1000)
        .size(4, { gridUnits: true })
        .fadeIn(2500)
        .opacity(1)
        .persist()
        .zIndex(2)
        .name(`Entangle`)
        .private()

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(5.6, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)

        .effect()
        .file("jb2a.swirling_leaves.outburst.01.greenorange")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.15, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_green`)
        .size(4.55, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .persist()
        .belowTokens()
        .zIndex(1)
        .name(`Entangle`)
        .waitUntilFinished()

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Entangle` })
    }
    let effectData = {
        'name': "Entangled",
        'icon': workflow.item.img,
        'description': "You are restrained by a mass of thick, entangling plants. You can use your action to make a Strength check. If you succeed, you are no longer restrained.",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, rollType=check, saveAbility=str, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ', saveMagic=true, name=Entangle: Action Save',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
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
    for (let i of Array.from(workflow.failedSaves)) {
        await chrisPremades.helpers.createEffect(i.actor, effectData);
        new Sequence()

            .effect()
            .delay(100)
            .file('jb2a.entangle.green')
            .attachTo(i)
            .fadeIn(5000)
            .zIndex(1)
            .fadeOut(1000)
            .scaleIn(0, 5000, { ease: "easeOutCubic" })
            .size(1.5, { gridUnits: true })
            .mask(i)
            .fadeOut(500)
            .persist()
            .name(`${i.document.name} Entangle`)

            .play()
    }
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Entangle" })
}

export let entangle = {
    'cast': cast,
    'item': item,
    'del': del
}