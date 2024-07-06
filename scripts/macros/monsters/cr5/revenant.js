import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let queueSetup = await queue.setup(workflow.item.uuid, 'revenantAttack', 250);
    if (!queueSetup) return;
    let selection = await mba.dialog("Sworn Vengeance", constants.yesNo, `Is <u>${target.document.name}</u> your sworn enemy?`);
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let type = await mba.dialog("Sworn Vengeance", [["Deal extra 4d6[bludgeoning] damage", "damage"], ["Automatically Grapple the target", "grapple"]], `<b>What would you like to do?</b>`);
    if (!type) type = "damage";
    if (type === "grapple") {
        await mbaPremades.macros.monsters.autoGrapple({ speaker, actor, token, character, item, args, scope, workflow });
        queue.remove(workflow.item.uuid);
    }
    else if (type === "damage") {
        let oldFormula = workflow.damageRoll._formula;
        let bonusDamageFormula = "4d6[bludgeoning]";
        if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
        let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
        let damageRoll = await new Roll(damageFormula).roll({ async: true });
        await workflow.setDamageRoll(damageRoll);
        queue.remove(workflow.item.uuid);
    }
}

async function vengefulGlare({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} RevVG` })
        };
        let effectData = {
            'name': "Revenant: Fear",
            'icon': "modules/mba-premades/icons/generic/petrifying_gaze.webp",
            'description': `
                <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Revenant's Presence for the duration.</p>
                <p>You can repeat the saving throw at the end of each of your turns, with disadvantage if you can see the revenant, ending the Frightened condition on a success.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Frightened",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=end, saveAbility=wis, saveDC=15, saveMagic=false, name=Fear: Turn End (DC15), killAnim=true',
                    'priority': 20
                },
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        if (!mbaPremades.helpers.checkTrait(token.actor, "ci", "frightened") && !mbaPremades.helpers.findEffect(token.actor, "Revenant: Fear")) {
            await mbaPremades.helpers.createEffect(token.actor, effectData);
        }
    };
    let effectData = {
        'name': "Revenant: Vengeful Glare",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} until Revenant deals damage to you, or until the start of Revenant's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Paralyzed",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isDamaged', 'turnStartSource'],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .attachTo(workflow.token)
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(1)
        .belowTokens()
        .randomRotation()
        .filter("ColorMatrix", { brightness: 0 })

        .effect()
        .file("jb2a.markers.02.purplepink")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(1)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .animateProperty("sprite", "position.x", { from: -0.5, to: 0.05, duration: 1000, gridUnits: true, ease: "easeOutBack", delay: 0 })
        .animateProperty("sprite", "width", { from: 0.8, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .animateProperty("sprite", "height", { from: 1, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })
        .rotate(0)
        .filter("Glow", { color: 0x000000 })
        .zIndex(1)

        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(1)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .rotate(0)
        .animateProperty("sprite", "position.x", { from: -0.5, to: 0.05, duration: 1000, gridUnits: true, ease: "easeOutBack", delay: 0 })
        .zIndex(0)
        .tint("#9e19e6")
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })

        .effect()
        .file("jb2a.particles.outward.purple.01.03")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(2.5)
        .delay(750)
        .duration(1500)
        .fadeOut(1500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.5, y: -0.1 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .tint("#9e19e6")
        .filter("ColorMatrix", { saturate: 1, hue: -2 })
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.toll_the_dead.purple.skull_smoke")
        .attachTo(target)
        .scaleToObject(1.65, { considerTokenScale: true })
        .filter("ColorMatrix", { saturate: 0.25, hue: -5 })
        .zIndex(1)

        .effect()
        .from(target)
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .fadeIn(500)
        .fadeOut(2000)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 0.5 })
        .opacity(0.65)
        .zIndex(0.1)

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .size(1 * target.document.width, { gridUnits: true })
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 20 })
        .zIndex(0.3)

        .effect()
        .file("jb2a.template_circle.symbol.normal.fear.dark_purple")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(500)
        .fadeIn(1000)
        .fadeOut(1500)
        .mask()
        .persist()
        .name(`${target.document.name} RevVG`)
        .playIf(() => {
            return (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "paralyzed") && !mba.findEffect(target.actor, "Revenant: Vengeful Glare"));
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "paralyzed") && !mba.findEffect(target.actor, "Revenant: Vengeful Glare")) {
                await mba.createEffect(target.actor, effectData);
            }
        })

        .play()
}

export let revenant = {
    'attack': attack,
    'vengefulGlare': vengefulGlare
}