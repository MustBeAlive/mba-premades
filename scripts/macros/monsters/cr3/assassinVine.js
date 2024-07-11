import { mba } from "../../../helperFunctions.js";

async function constrict({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) return;
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AssViCon` })
    }
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.feature.grapple.origin',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
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
                'value': 'turn=start, damageType=poison, damageRoll=6d6, damageBeforeSave=true, name=Poisonous Vines: Turn Start, killAnim=true, fastForwardDamage=true',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.assassinVine?.constrict?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `${workflow.token.document.name}: Grapple (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP', 'combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'assassinVine': {
                        'constrict': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.melee_generic.slashing.two_handed")
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 70 })

        .effect()
        .file("jb2a.melee_generic.slashing.two_handed")
        .mirrorY()
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 70 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.entangle.green")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} AssViCon`)

        .play()

}

async function entanglingVinesCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Entangling Vines Template");
    if (effect) await mba.removeEffect(effect);
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
        .size(3.4, { gridUnits: true })
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
        .name(`Assassin Vine Entangle`)

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.85)
        .fadeOut(500)
        .size(3.4, { gridUnits: true })
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
        .name(`Assassin Vine Entangle`)

        .effect()
        .file("jb2a.entangle.green")
        .atLocation(template)
        .delay(1000)
        .fadeIn(2000)
        .opacity(0.75)
        .fadeOut(500)
        .size(3.4, { gridUnits: true })
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
        .persist()
        .name(`Assassin Vine Entangle`)

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(4.6, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)
        .name(`Assassin Vine Entangle`)

        .effect()
        .atLocation(template)
        .file(`jb2a.fireflies.many.01.green`)
        .delay(1000)
        .size(3, { gridUnits: true })
        .fadeIn(2500)
        .opacity(1)
        .zIndex(2)
        .persist()
        .name(`Assassin Vine Entangle`)

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .atLocation(template)
        .delay(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(4.6, { gridUnits: true })
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
        .size(3.55, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1)
        .waitUntilFinished()
        .persist()
        .name(`Assassin Vine Entangle`)

        .play()
}

async function entanglingVinesItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AssViEn` })
    };
    const effectData = {
        'name': "Assassin Vine: Entangle",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by Assassin Vine's entangling roots.</p>
            <p>You can use your action to make a DC 13 Strength check, freeing yourself or another entangled creature within reach on a success.</p>
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
                'value': `actionSave=true, rollType=skill, saveAbility=ath, saveDC=13, saveMagic=false, name=Restrain: Action Save (DC13), killAnim=true`,
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
            .name(`${target.document.name} AssViEn`)
            .playIf(() => {
                return (!mba.checkTrait(target.actor, "ci", "restrained") && !mba.findEffect(target.actor, "Assassin Vine: Entangle"));
            })

            .thenDo(async () => {
                if (!mba.checkTrait(target.actor, "ci", "restrained") && !mba.findEffect(target.actor, "Assassin Vine: Entangle")) await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Assassin Vine Entangle" })
}

export let assassinVine = {
    'constrict': constrict,
    'entanglingVinesCast': entanglingVinesCast,
    'entanglingVinesItem': entanglingVinesItem,
    'del': del
}