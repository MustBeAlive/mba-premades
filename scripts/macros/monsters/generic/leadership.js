import {mba} from "../../../helperFunctions.js";

export async function leadership({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (workflow.token.document.disposition != target.document.disposition) {
        ui.notifications.warn("Target is not an ally!");
        return;
    }
    async function effectMacroEachTurn() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Leadership");
        if (!effect) return;
        let origin = await fromUuid(effect.flags['mba-premades']?.feature?.leadership?.originUuid);
        if (!mbaPremades.helpers.findEffect(origin.actor, "Dead") || !mbaPremades.helpers.findEffect(origin.actor, "Incapacitated")) return;
        await mbaPremades.helpers.removeEffect(effect)
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>${workflow.token.document.name} has inspired you.</p>
            <p>For the duration, you have 1d4 bonus to all attack rolls and saving throws.</p>
            <p>This effect ends early if ${workflow.token.document.name} is incapacitated or dead.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            },
            {
                'key': 'system.bonuses.All-Attacks',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEachTurn)
                }
            },
            'mba-premades': {
                'feature': {
                    'leadership': {
                        'originUuid': workflow.token.document.uuid
                    }
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 1 })
        .zIndex(1)

        .effect()
        .file("jb2a.bless.200px.intro.yellow")
        .attachTo(workflow.token)
        .scaleToObject(1.35, { considerTokenScale: true })
        .belowTokens()
        .filter("ColorMatrix", { saturate: 1, hue: -10 })

        .wait(1000)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02.fast")
        .atLocation(workflow.token)
        .scaleToObject(7)
        .fadeOut(900)
        .opacity(0.35)
        .belowTokens()
        .tint("#ff6120")
        .zIndex(1)

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(workflow.token)
        .scale(0.25)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.5, duration: 1000, gridUnits: true })
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.symbol.01")
        .atLocation(workflow.token, { offset: { x: 0.07, y: -0.75 }, gridUnits: true })
        .scaleToObject(3.5)
        .filter("ColorMatrix", { hue: 175 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.misc.symbol.01")
        .atLocation(workflow.token, { offset: { x: 0.07, y: -0.7 }, gridUnits: true })
        .scaleToObject(3.5)
        .filter("ColorMatrix", { brightness: 0, hue: 165 })
        .filter("Blur", { blurX: 5, blurY: 10 })

        .wait(1000)

        .effect()
        .file("jb2a.bless.200px.intro.yellow")
        .attachTo(target)
        .scaleToObject(1.35, { considerTokenScale: true })
        .belowTokens()
        .filter("ColorMatrix", { saturate: 1, hue: -10 })
        
        .wait(1000)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(target)
        .scale(0.25)
        .playbackRate(1)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.5, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.energy.06")
        .atLocation(target, { offset: { x: 0.0, y: -0.75 }, gridUnits: true })
        .scaleToObject(1)
        .filter("ColorMatrix", { hue: 175 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.energy.06")
        .atLocation(target, { offset: { x: 0.0, y: -0.7 }, gridUnits: true })
        .scaleToObject(1)
        .filter("ColorMatrix", { brightness: 0, hue: 165 })
        .filter("Blur", { blurX: 5, blurY: 10 })

        .play()
}