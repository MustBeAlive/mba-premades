import {mba} from "../../../helperFunctions.js";

export async function arcaneLock({ speaker, actor, token, character, item, args, scope, workflow }) {
    let optionsPlayer = [["Door/Gate", "door"], ["Window/Chest/Other entryway", "other"]];
    let selectionPlayer = await mba.dialog("Aracane Lock", optionsPlayer, "<b>What are you attempting to lock?</b>");
    if (!selectionPlayer) return;
    if (selectionPlayer === "other") {
        new Sequence()

            .effect()
            .file("icons/svg/padlock.svg")
            .atLocation(token)
            .size(0.5, { gridUnits: true })
            .duration(1700)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(1)
            .filter("Glow", { color: 0x004db3, innerStrength: 1, knockout: true })
            .aboveLighting()
            .xray()

            .effect()
            .file("jb2a.markers.chain.spectral_standard.complete.02.blue")
            .atLocation(token)
            .size(0.5 + 0.8, { gridUnits: true })
            .duration(1700)
            .fadeOut(1000)
            .scaleIn(0, 250, { ease: "easeOutCubic" })
            .startTime(5500)
            .spriteRotation(-90)
            .aboveLighting()
            .xray()
            .randomRotation()
            .zIndex(1)

            .wait(1000)

            .effect()
            .file("jb2a.impact.004.blue")
            .atLocation(token)
            .size(1.75, { gridUnits: true })
            .fadeOut(1000)
            .aboveLighting()
            .xray()
            .zIndex(0)
            .waitUntilFinished(-1100)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.57")
            .atLocation(token, { offset: { x: 0.2, y: -0.2 }, gridUnits: true })
            .size(4, { gridUnits: true })
            .fadeOut(1000)
            .belowTokens()
            .playbackRate(1.5)
            .opacity(0.2)

            .effect()
            .file("jb2a.particles.outward.white.01.03")
            .atLocation(token)
            .size(3, { gridUnits: true })
            .duration(1500)
            .fadeOut(1500)
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .animateProperty("sprite", "position.y", { from: 0, to: 0.1, duration: 1500, gridUnits: true })
            .zIndex(5)

            .canvasPan()
            .shake({ duration: 500, strength: 2, rotation: false, fadeOut: 500 })

            .play()
    }
    else if (selectionPlayer === "door") {
        const aoeDistance = 3;
        let config = {
            size: aoeDistance / canvas.scene.grid.distance,
            icon: workflow.item.img,
            label: 'Arcane Lock',
            tag: 'Arcane Lock',
            drawIcon: true,
            drawOutline: true,
            interval: 0,
            rememberControlled: true,
        };
        let position = await warpgate.crosshairs.show(config);
        let effectLocation = position;
        let effectSize = 0.25;
        const captureArea = {
            x: position.x,
            y: position.y,
            scene: canvas.scene,
            radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
        };
        const containedWalls = warpgate.crosshairs.collect(captureArea, 'Wall')
        const door = containedWalls.find(wall => wall.door >= 1 && wall.ds != 2);
        if (!door) {
            ui.notifications.warn("Door not found!");
            return;
        }
        const doorX = (door.c[0] + door.c[2]) / 2;
        const doorY = (door.c[1] + door.c[3]) / 2;
        effectLocation = { x: doorX, y: doorY };
        effectSize = door._object.doorControl.hitArea.width / canvas.grid.size;
        let updates = { 'ds': 2 };

        new Sequence()

            .effect()
            .file("icons/svg/padlock.svg")
            .atLocation(effectLocation)
            .size(effectSize, { gridUnits: true })
            .duration(1700)
            .fadeIn(500)
            .opacity(1)
            .filter("Glow", { color: 0x004db3, innerStrength: 1, knockout: true })
            .aboveLighting()
            .xray()

            .effect()
            .file("jb2a.markers.chain.spectral_standard.complete.02.blue")
            .atLocation(effectLocation)
            .size(effectSize + 0.8, { gridUnits: true })
            .duration(1700)
            .scaleIn(0, 250, { ease: "easeOutCubic" })
            .startTime(5500)
            .spriteRotation(-90)
            .aboveLighting()
            .xray()
            .randomRotation()
            .zIndex(1)

            .wait(1000)

            .effect()
            .file("jb2a.impact.004.blue")
            .atLocation(effectLocation)
            .size(1.75, { gridUnits: true })
            .aboveLighting()
            .xray()
            .zIndex(0)
            .waitUntilFinished(-1100)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.57")
            .atLocation(effectLocation, { offset: { x: 0.2, y: -0.2 }, gridUnits: true })
            .size(4, { gridUnits: true })
            .belowTokens()
            .playbackRate(1.5)
            .opacity(0.2)

            .effect()
            .file("jb2a.particles.outward.white.01.03")
            .atLocation(position)
            .size(3, { gridUnits: true })
            .duration(1500)
            .fadeOut(1500)
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .animateProperty("sprite", "position.y", { from: 0, to: 0.1, duration: 1500, gridUnits: true })
            .zIndex(5)

            .canvasPan()
            .shake({ duration: 500, strength: 2, rotation: false, fadeOut: 500 })

            .thenDo(async () => {
                mba.updateDoc(door, updates);
            })

            .play()
    }
}