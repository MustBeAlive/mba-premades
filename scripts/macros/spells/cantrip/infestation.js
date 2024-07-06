export async function infestation({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jaamod.spells_effects.insect_plague0")
        .attachTo(target)
        .scaleToObject(1.4 * target.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(1000)
        .duration(5000)
        .mask()

        .play()

    if (!workflow.failedSaves.size) return;
    let movement = Object.values(target.actor.system.attributes.movement);
    if (!movement.find(i => i >= 5)) {
        ui.notifications.info("Target doesn't have enough movement to be forced to move!");
        return;
    }
    const directionRoll = await new Roll(`1d4`).roll({ async: true });
    await MidiQOL.displayDSNForRoll(directionRoll)
    const directionResult = directionRoll.total;
    const directions = ["North", "South", "East", "West"];
    const directionContent = directions[directionResult - 1];
    const walkSpeedFeet = 5;
    const gridDistance = canvas.dimensions.distance;
    const pixelsPerFoot = canvas.scene.grid.size / gridDistance;
    const moveDistancePixels = walkSpeedFeet * pixelsPerFoot;
    let moveX = 0;
    let moveY = 0;
    switch (directionContent) {
        case "North":
            moveY = -moveDistancePixels;
            break;
        case "South":
            moveY = moveDistancePixels;
            break;
        case "East":
            moveX = moveDistancePixels;
            break;
        case "West":
            moveX = -moveDistancePixels;
            break;
    }
    const newX = target.x + moveX;
    const newY = target.y + moveY;
    let targetUpdate = {
        'token': {
            'x': newX,
            'y': newY
        }
    };
    let options = {
        'permanent': true,
        'name': workflow.item.name,
        'description': workflow.item.name,
        'updateOpts': { 'token': { 'animate': true } }
    };
    let endPoint = new PIXI.Point(newX, newY);
    let collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(target.center, endPoint, { type: "move", mode: "any" });
    if (collisionDetected) {
        let directionVector = { x: moveX, y: moveY };
        let magnitude = Math.hypot(directionVector.x, directionVector.y);
        directionVector.x /= magnitude;
        directionVector.y /= magnitude;

        let totalSteps = moveDistancePixels / (canvas.scene.grid.size / 10);
        let collisionDetected = false;
        let stepCounter = 0;

        for (let step = 1; step <= totalSteps; step++) {
            let nextX = target.x + directionVector.x * (canvas.scene.grid.size / 10) * step;
            let nextY = target.y + directionVector.y * (canvas.scene.grid.size / 10) * step;
            let nextPoint = new PIXI.Point(nextX, nextY);
            collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(target.center, nextPoint, { type: "move", mode: "any" });
            if (collisionDetected) {
                break;
            }
            stepCounter = step;
        }

        let finalX = target.x + directionVector.x * (canvas.scene.grid.size / 10) * stepCounter;
        let finalY = target.y + directionVector.y * (canvas.scene.grid.size / 10) * stepCounter;
        let distanceMovedInFeet = (stepCounter * (canvas.scene.grid.size / 10)) / pixelsPerFoot;

        targetUpdate = {
            'token': {
                'x': finalX,
                'y': finalY
            }
        }

        if (stepCounter > 0) {
            await warpgate.mutate(target.document, targetUpdate, {}, options);
            let content = `<p>The movement roll for ${target.actor.name} is <b>${directionResult}</b>.</p><p>${target.actor.name} moves ${directionContent} using ${distanceMovedInFeet} feet of their movement before hitting an obstacle.</p>`
            let actorPlayer = MidiQOL.playerForActor(target.actor);
            let chatData = {
                user: actorPlayer.id,
                speaker: ChatMessage.getSpeaker({ token: target }),
                content: content,
                roll: directionRoll
            };
            ChatMessage.create(chatData);
        } else {
            let content = `The movement for ${target.actor.name} does not occur because the way is blocked.`
            let actorPlayer = MidiQOL.playerForActor(target.actor);
            let chatData = {
                user: actorPlayer.id,
                speaker: ChatMessage.getSpeaker({ token: target }),
                content: content,
                roll: directionRoll
            };
            ChatMessage.create(chatData);
        }
        return;
    }

    await warpgate.mutate(target.document, targetUpdate, {}, options);
    let content = `<p>The movement roll for ${target.actor.name} is <b>${directionResult}</b>.</p><p>${target.actor.name} moves ${directionContent} using 5 feet of their movement.</p><p>This movement does not provoke Opportunity Attacks.</p>`
    let actorPlayer = MidiQOL.playerForActor(target.actor);
    let chatData = {
        user: actorPlayer.id,
        speaker: ChatMessage.getSpeaker({ token: target }),
        content: content,
        roll: directionRoll
    };
    ChatMessage.create(chatData);
}