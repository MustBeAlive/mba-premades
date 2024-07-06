import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

// To do: mechanics part

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.air.portal")
        .attachTo(template, { offset: { y: -0.25 }, gridUnits: true })
        .size(6, { gridUnits: true })
        .delay(750)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeInCirc" })
        .rotateIn(-360, 1000, { ease: "easeOutCubic" })
        .opacity(0.45)
        .mirrorX()
        .belowTokens()
        .filter("ColorMatrix", { saturate: -0.5, brightness: 1.35, hue: -40 })
        .tint("#878787")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(template)
        .size(7, { gridUnits: true })
        .fadeIn(1000, { ease: "easeInCubic" })
        .fadeIn(500)
        .opacity(0.45)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -0.25, brightness: 1.15, hue: -30 })
        .tint("#878787")
        .persist()
        .name("Whirlwind")

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .attachTo(template)
        .size(7, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(750)
        .scaleIn(0, 1000, { ease: "easeInCubic" })
        .rotateIn(-900, 1000, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1500 })
        .scaleOut(1, 500, { ease: "easeOutCubic", delay: 250 })
        .rotateOut(360, 500, { ease: "easeOutCubic", delay: 250 })
        .belowTokens()
        .filter("ColorMatrix", { hue: -25 })
        .persist()
        .name("Whirlwind")

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .duration(7000)
        .fadeIn(500)
        .fadeOut(750)
        .scaleIn(0, 1000, { ease: "easeInCubic" })
        .rotateIn(-900, 1000, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1400 })
        .scaleOut(1, 500, { ease: "easeOutCubic", delay: 250 })
        .rotateOut(-360, 500, { ease: "easeOutCubic", delay: 250 })
        .rotate(90)
        .opacity(0.65)
        .zIndex(2)
        .filter("ColorMatrix", { hue: -25 })
        .persist()
        .name("Whirlwind")

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .attachTo(template)
        .size(4, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(750)
        .scaleIn(0, 1000, { ease: "easeInCubic" })
        .rotateIn(-900, 1000, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1300 })
        .scaleOut(1, 500, { ease: "easeOutCubic", delay: 250 })
        .rotateOut(360, 500, { ease: "easeOutCubic", delay: 250 })
        .rotate(180)
        .opacity(0.4)
        .zIndex(3)
        .filter("ColorMatrix", { hue: -25 })
        .persist()
        .name("Whirlwind")

        .effect()
        .file("jb2a.sleep.cloud.02.blue")
        .attachTo(template)
        .size(2, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(750)
        .scaleIn(0, 1000, { ease: "easeInCubic" })
        .rotateIn(-900, 1000, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1200 })
        .scaleOut(1, 500, { ease: "easeOutCubic", delay: 250 })
        .rotateOut(-360, 500, { ease: "easeOutCubic", delay: 250 })
        .opacity(0.25)
        .zIndex(4)
        .rotate(180)
        .filter("ColorMatrix", { hue: -25 })
        .name("Whirlwind")
        .persist()

        .effect()
        .file("jb2a.sleep.cloud.02.blue")
        .attachTo(template)
        .size(1, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(750)
        .scaleIn(0, 1000, { ease: "easeInCubic" })
        .rotateIn(-900, 1000, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1100 })
        .scaleOut(1, 500, { ease: "easeOutCubic", delay: 250 })
        .rotateOut(360, 500, { ease: "easeOutCubic", delay: 250 })
        .opacity(0.15)
        .zIndex(5)
        .rotate(180)
        .filter("ColorMatrix", { hue: -25 })
        .persist()
        .name("Whirlwind")

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await whirlwind.trigger(token.document, trigger);
}

async function trigger(token, trigger) {

}

export let whirlwind = {
    'cast': cast,
    'enter': enter,
    'trigger': trigger
}