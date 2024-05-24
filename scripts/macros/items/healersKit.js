import {mba} from "../../helperFunctions.js";

export async function healersKit({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 0 || !mba.findEffect(target.actor, "Unconscious")) {
        ui.notifications.warn("Target is not unconscious!");
        return;
    }
    if (mba.findEffect(target.actor, "Healer's Kit: Stabilized")) {
        ui.notifications.warn("Target is already stable!");
        return;
    }
    if (target.actor.system.attributes.death.success) {
        ui.notifications.warn("Target is already stable!");
        return;
    }
    if (target.actor.system.attributes.death.failure > 2) {
        ui.notifications.warn("Healer's Kit has no effect!");
        return;
    }
    let potioncolor = "green";
    let defaults = {
        "green": {
            "color": "green",
            "particles": "greenyellow",
            "tintColor": "0xbbf000",
            "hue1": -105,
            "hue2": 35,
            "hue3": 0,
            "saturate": 1
        }
    };
    let config = defaults[potioncolor];
    const effectData = {
        'name': "Healer's Kit: Stabilized",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `You are stable and no longer have to make death saving throws.`,
        'changes': [
            {
                'key': 'system.attributes.death.success',
                'mode': 5,
                'value': 3,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isHealed', 'shortRest', 'longRest', 'isDamaged']
            }
        }
    };

    await new Sequence()

        .wait(500)

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
        .opacity(0.9)
        .rotate(90)
        .filter("ColorMatrix", { saturate: config.saturate, hue: config.hue1 })
        .zIndex(1)

        .wait(200)

        .effect()
        .file(`jb2a.sacred_flame.source.${config.color}`)
        .attachTo(target, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
        .startTime(3400)
        .scaleToObject(2.2)
        .fadeOut(500)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { hue: config.hue3 })
        .zIndex(1)

        .effect()
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .opacity(0.3)
        .duration(1250)
        .fadeIn(100)
        .fadeOut(600)
        .filter("Glow", { color: config.tintColor })
        .tint(config.tintColor)

        .effect()
        .file(`jb2a.particles.outward.${config.particles}.01.03`)
        .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .scale(0.6)
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .zIndex(0.3)
        .waitUntilFinished(-500)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play();
}