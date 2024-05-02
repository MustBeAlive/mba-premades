export async function knock({ speaker, actor, token, character, item, args, scope, workflow }) {
    const aoeDistance = 3;
    let config = {
        size: aoeDistance / canvas.scene.grid.distance,
        icon: workflow.item.img,
        label: 'Knock',
        tag: 'Knock',
        drawIcon: true,
        drawOutline: true,
        interval: 0,
        rememberControlled: true,
    };
    let position = await warpgate.crosshairs.show(config);
    let effectLocation = position
    let effectRotation = 0;
    let effectSize = 0.25;
    const captureArea = {
        x: position.x,
        y: position.y,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedWalls = warpgate.crosshairs.collect(captureArea, 'Wall')
    const lockedDoor = containedWalls.find(wall => wall.door >= 1 && wall.ds === 2);
    if (!lockedDoor) {
        ui.notifications.warn("Door not found!");
        return;
    }
    const doorX = (lockedDoor.c[0] + lockedDoor.c[2]) / 2;
    const doorY = (lockedDoor.c[1] + lockedDoor.c[3]) / 2;
    effectLocation = { x: doorX, y: doorY };

    //Determine rotation of the door
    const slope = (lockedDoor.c[3] - lockedDoor.c[1]) / (lockedDoor.c[2] - lockedDoor.c[0]);
    const angleRadians = Math.atan(slope);
    effectRotation = angleRadians * (180 / Math.PI);
    effectSize = lockedDoor._object.doorControl.hitArea.width / canvas.grid.size;

    let updates = { 'ds': 0 };
    let options = [["Yes, door can be opened", "yes"], ["No, deny request", "no"]];
    let selection = await chrisPremades.helpers.remoteDialog("Knock", options, game.users.activeGM.id, `<b>${workflow.token.document.name}</b> attempts cast knock on the door:`);

    new Sequence()

        .effect()
        .file("icons/svg/padlock.svg")
        .atLocation(effectLocation)
        .size(effectSize, { gridUnits: true })
        .opacity(1)
        .filter("Glow", { color: 0xdabc25, innerStrength: 1, knockout: true })
        .fadeIn(500)
        .aboveLighting()
        .xray()
        .duration(1700)

        .effect()
        .file("jb2a.markers.chain.spectral_standard.complete.02.blue")
        .atLocation(effectLocation)
        .size(effectSize + 0.8, { gridUnits: true })
        .spriteRotation(-90)
        .aboveLighting()
        .filter("ColorMatrix", { hue: 230 })
        .xray()
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .startTime(5500)
        .randomRotation()
        .zIndex(1)
        .duration(1700)

        .wait(1000)

        .effect()
        .file("jb2a.shatter.orange")
        .atLocation(effectLocation)
        .size(1.75, { gridUnits: true })
        .aboveLighting()
        .xray()
        .zIndex(0)
        .waitUntilFinished(-1500)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.57")
        .atLocation(effectLocation, { offset: { x: 0.2, y: -0.2 }, gridUnits: true })
        .size(4, { gridUnits: true })
        .belowTokens()
        .playbackRate(1.5)
        .opacity(0.2)

        .effect()
        .file("jb2a.particles.outward.white.01.03")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1500)
        .atLocation(position)
        .duration(1500)
        .size(3, { gridUnits: true })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.1, duration: 1500, gridUnits: true })
        .zIndex(5)

        .canvasPan()
        .shake({ duration: 500, strength: 2, rotation: false, fadeOut: 500 })

        .thenDo(function () {
            if (selection === "yes") {
                mbaPremades.helpers.updateDoc(lockedDoor, updates);
            }
        })

        .play()
}