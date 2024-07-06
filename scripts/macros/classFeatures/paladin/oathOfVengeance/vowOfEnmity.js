import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        return;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any Channel Divinity uses left!");
        return;
    }
    let target = workflow.targets.first();
    async function effectMacroDelSource() {
        let targetTokenId = effect.changes[0].value;
        let target = canvas.scene.tokens.get(targetTokenId);
        if (!target) return;
        let targetEffect = await mbaPremades.helpers.findEffect(target.actor, "Vow of Enmity: Target");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': "Vow of Enmity",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on attack rolls against <u>${target.document.name}</u> for the duration.</p>
            <p>Effect ends early if target drops to 0 hit points or falls unconscious.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.mba-premades.feature.vowOfEnmity',
                'mode': 5,
                'value': target.id,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.vowOfEnmity.attack,preAttackRoll',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'vowOfEnmity': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    }
    async function effectMacroEveryTurn() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Vow of Enmity: Target");
        if (!effect) return;
        let incapacitated = await mbaPremades.helpers.findEffect(actor, "Incapacitated");
        if (!incapacitated) return;
        await mbaPremades.helpers.removeEffect(effect);
    };
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} VoE` })
        await mbaPremades.macros.vowOfEnmity.removed(origin);
    };
    let effectDataTarget = {
        'name': "Vow of Enmity: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                },
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
        .file("jb2a.magic_signs.rune.conjuration.intro.purple")
        .attachTo(target)
        .scaleToObject(0.5)
        .fadeOut(500, { ease: "easeInCubic" })
        .scaleOut(0, 1000, { ease: "easeInBack" })
        .zIndex(1)
    
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
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .attachTo(target)
        .scaleToObject(1.5)
        .belowTokens()
        .zIndex(0)
        .tint("#9e19e6")
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })
    
        .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .attachTo(target)
        .scaleToObject(1.8)
        .delay(550)
        .scaleOut(0, 1000, { ease: "easeInBack" })
        .randomRotation()
        .belowTokens()
    
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
        .from(target)
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(1000)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.75)
        .mirrorX(token.document.data.mirrorX)
        .tint("#9e19e6")
        .name(`${target.document.name} VoE`)
    
        .effect()
        .file(`jb2a.particles.outward.white.01.03`)
        .attachTo(target, { offset: { y: 0.2 }, gridUnits: true, followRotation: false })
        .scaleToObject()
        .delay(100)
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: -0, to: -0.6, duration: 1000, gridUnits: true })
        .tint("#9e19e6")
        .filter("Blur", { blurX: 0, blurY: 5 })
        .opacity(0.8)
        .zIndex(0.3)
    
        .effect()
        .file("jb2a.static_electricity.03.dark_purple")
        .atLocation(target)
        .size(1.25, { gridUnits: true })
        .delay(750)
        .opacity(1)
        .playbackRate(1)
        .randomRotation()
        .zIndex(0.3)
    
        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(target, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.45, { considerTokenScale: true })
        .delay(500)
        .fadeIn(1000)
        .fadeOut(500)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .randomRotation()
        .belowTokens()
        .opacity(0.45)
        .filter("ColorMatrix", { brightness: 0 })
        .persist()
        .name(`${target.document.name} VoE`)
    
        .effect()
        .from(target)
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1, { considerTokenScale: true })
        .delay(500)
        .fadeIn(1000)
        .fadeOut(500)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .belowTokens()
        .mirrorX(workflow.token.document.data.mirrorX)
        .zIndex(0.1)
        .filter("Glow", { color: 0x9e19e6, distance: 5, outerStrength: 4, innerStrength: 0 })
        .persist()
        .name(`${target.document.name} VoE`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectDataSource);
            await mba.createEffect(target.actor, effectDataTarget);
            await CDItem.update({ "system.uses.value": uses -= 1 });
        })

        .play();
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1 || !constants.attacks.includes(workflow.item.system.actionType)) return;
    let targetId = workflow.actor.flags['mba-premades']?.feature?.vowOfEnmity;
    if (!targetId) return;
    if (workflow.targets.first().id != targetId) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'vowOfEnmity', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Vow of Enmity");
    queue.remove(workflow.item.uuid);
}

async function removed(origin) {
    let casterEffect = mba.findEffect(origin.actor, "Vow of Enmity");
    if (casterEffect) await mba.removeEffect(casterEffect);
}

export let vowOfEnmity = {
    'item': item,
    'attack': attack,
    'removed': removed
}