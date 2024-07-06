import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function autoGrapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    let saveDC = workflow.item.system.save.dc;
    let effectData = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    for (let target of Array.from(workflow.targets)) {
        if (mba.findEffect(target.actor, "Grappled")) continue;
        if (mba.getSize(target.actor) > 3) continue;
        await new Sequence()

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .atLocation(workflow.token)
            .stretchTo(target)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .mirrorY()
            .atLocation(workflow.token)
            .stretchTo(target)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .wait(150)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.markers.chain.standard.complete.02.grey")
            .attachTo(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.8)

            .play()
    }
}

async function entangleCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep:');
    if (selection.buttons === false) return;
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
    await warpgate.wait(100);
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.95)
        .fadeOut(500)
        .size(6.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 1.4,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .persist()
        .zIndex(1.5)
        .name(`Vine Blight Entangle`)

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.85)
        .fadeOut(500)
        .size(6.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 3,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .zIndex(1.3)
        .persist()
        .name(`Vine Blight Entangle`)

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.75)
        .fadeOut(500)
        .size(6.4, { gridUnits: true })
        .belowTokens()
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 4,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .zIndex(1.2)
        .spriteRotation(45)
        .persist()
        .name(`Vine Blight Entangle`)

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(7.6, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)
        .name(`Vine Blight Entangle`)

        .effect()
        .atLocation(template)
        .file(`jb2a.fireflies.many.01.green`)
        .delay(1000)
        .size(6, { gridUnits: true })
        .fadeIn(2500)
        .opacity(1)
        .zIndex(2)
        .persist()
        .name(`Vine Blight Entangle`)

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(7.6, { gridUnits: true })
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
        .size(3.5, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.15, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_green`)
        .size(6.55, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1)
        .waitUntilFinished()
        .persist()
        .name(`Vine Blight Entangle`)

        .play()
}

async function entangleItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} VBR` })
    };
    const effectData = {
        'name': "Vine Blight: Entangle",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by Vine Blight's entangling roots.</p>
            <p>You can use your action to make a DC 12 Strength check, freeing yourself or another entangled creature within reach on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=12, saveMagic=false, name=Restrain: Action Save (DC12), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        if (mba.raceOrType(target.actor) === "plant") continue;
        if (mba.findEffect(target.actor, "Restrained")) continue;
        new Sequence()

            .effect()
            .delay(100)
            .file('jb2a.entangle.green')
            .attachTo(target)
            .fadeIn(5000)
            .zIndex(1)
            .fadeOut(1000)
            .scaleIn(0, 5000, { ease: "easeOutCubic" })
            .size(1.5, { gridUnits: true })
            .mask(target)
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} VBR`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Vine Blight Entangle" })
}

export let vineBlight = {
    'autoGrapple': autoGrapple,
    'entangleItem': entangleItem,
    'entangleCast': entangleCast,
    'del': del
}