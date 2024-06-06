import {mba} from "../../../../helperFunctions.js";

export async function eyesOfTheGrave({ speaker, actor, token, character, item, args, scope, workflow }) {
    const aoeDistance = 60;
    const captureArea = {
        x: token.x + (canvas.grid.size * token.document.width) / 2,
        y: token.y + (canvas.grid.size * token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.eyes.01.dark_purple.single.2")
        .attachTo(token)
        .scaleToObject(1.2)
        .delay(1500)
        .fadeIn(1000)
        .fadeOut(1000)

        //First Wave

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(0)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(90)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(180)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(270)
        .name(`top`)

        //Second Wave

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(45)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(135)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(225)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(token, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(315)
        .name(`top`)

        .play()

    targets.forEach(target => {
        if (target.name !== token.name) {
            const distance = Math.sqrt(
                Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2)
            );
            let [canSee] = MidiQOL.findNearby(null, workflow.token, 60, { includeIncapacitated: false, isSeen: true, includeToken: false }).filter(i => i.document.name === target.name);
            const gridDistance = distance / canvas.grid.size

            new Sequence()

                .effect()
                .file("jb2a.markers.circle_of_stars.green")
                .attachTo(target)
                .scaleToObject(2.5)
                .delay(gridDistance * 125)
                .duration(5000)
                .fadeIn(500)
                .fadeOut(1000)
                .filter("ColorMatrix", { hue: 140})
                .mask()

                .wait(500)

                //Undead Effect
                .effect()
                .from(target)
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .delay(gridDistance * 125)
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .spriteRotation(target.rotation * -1)
                .loopProperty("alphaFilter", "alpha", { values: [0.9, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .filter("Glow", { color: 0x111111, distance: 20 })
                .belowTokens()
                .opacity(0.9)
                .zIndex(0.1)
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    if (!canSee) return false;
                    return mba.raceOrType(target.actor) === "undead";
                })

                .effect()
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .delay(gridDistance * 125)
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .randomRotation()
                .tint(0x121212)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    if (!canSee) return false;
                    return mba.raceOrType(target.actor) === "undead";
                })

                .play()
        }
    })
}