import {mba} from "../../../helperFunctions.js";

export async function acidSplash({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    if (!targets.length) return;
    if (targets.length === 2) {
        let distance = mba.getDistance(targets[0], targets[1]);
        if (distance > 5) {
            ui.notifications.warn('Targets are not within 5 ft. of each other!');
            return false;
        }
    };
    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.ranged.04.projectile.01.green")
            .atLocation(workflow.token)
            .stretchTo(target)
            .waitUntilFinished(-1400)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .randomRotation()
            .opacity(0.8)
            .mask(target)
            .zIndex(0.1)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(500)
            .tint("#BEE43E")
            .opacity(0.4)
            .randomizeMirrorX()
            .zIndex(0.2)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .opacity(0.8)
            .randomRotation()
            .mask(target)
            .zIndex(0.1)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(500)
            .opacity(0.4)
            .tint("#BEE43E")
            .randomizeMirrorX()
            .zIndex(0.2)

            .effect()
            .file("jb2a.grease.dark_grey.loop")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.4)
            .fadeIn(2000)
            .fadeOut(2000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .tint("#BEE43E")
            .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
            .opacity(0.8)
            .randomRotation()
            .mask(target)
            .zIndex(0.1)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.97")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.3)
            .delay(100, 1000)
            .fadeIn(500)
            .fadeOut(500)
            .tint("#BEE43E")
            .opacity(0.4)
            .randomizeMirrorX()
            .zIndex(0.2)

            .play()
    }
}