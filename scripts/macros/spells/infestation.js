export async function infestation({speaker, actor, token, character, item, args, scope, workflow}) {
    if(args[0].macroPass === "postSave" && workflow.failedSaves.first()) {
        let target = workflow.failedSaves.first();
        let effectData = [
            {
            "icon": "assets/library/icons/sorted/spells/cantrip/infestation.webp",
            "origin": "Actor.PpeGTVYvVoFsdZZD.Item.YXszBDQFBUYTzN3r",
            "duration": {
                "rounds": null,
                "startTime": null,
                "seconds": 1,
                "combat": null,
                "turns": null,
                "startRound": null,
                "startTurn": null
            },
            "disabled": false,
            "name": "Infestation"
            }
        ];
    
        await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.actor.uuid, effects: effectData });
    
        let directionResult;
    
        const directionRoll = await new Roll(`1d4`).roll({async: true});
        await MidiQOL.displayDSNForRoll(directionRoll, 'damageRoll')
        directionResult = directionRoll.total;
        const directions = ["North", "South", "East", "West"];
        const directionContent = directions[directionResult - 1];
    
        // target's walk speed in feet (adjust gridDistance to match your settings)
        const walkSpeedFeet = 5;
        const gridDistance = canvas.dimensions.distance; // Feet per grid cell
        const pixelsPerFoot = canvas.scene.grid.size / gridDistance;
    
        // Calculate total movement in pixels
        const moveDistancePixels = walkSpeedFeet * pixelsPerFoot;
        let moveX = 0;
        let moveY = 0;
    
        switch(directionContent) {
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
    
        // Calculate total intended movement
        const newX = target.x + moveX;
        const newY = target.y + moveY;
    
        // First, check for collision for the entire intended movement
        let endPoint = new PIXI.Point(newX, newY);
        let collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(target.center, endPoint, {type:"move", mode:"any"});
    
        if (!collisionDetected) {
            // If no collision is detected, move the target to the new position
            await target.document.update({ x: newX, y: newY });
            let content = `The movement roll for ${target.actor.name} is ${directionResult}: ${target.actor.name} moves ${directionContent} using 5 feet of their movement. This does not provoke Opportunity Attacks.`
            let actorPlayer = MidiQOL.playerForActor(target.actor);
            let chatData = {
                user: actorPlayer.id,
                speaker: ChatMessage.getSpeaker({ token: target }),
                content: content,
                roll: directionRoll
            };
            ChatMessage.create(chatData);
        } else {
        // Calculate the direction vector based on the intended direction
        let directionVector = { x: moveX, y: moveY };
        let magnitude = Math.hypot(directionVector.x, directionVector.y);
        // Normalize the direction vector
        directionVector.x /= magnitude;
        directionVector.y /= magnitude;
    
        // Calculate the number of steps based on the total intended movement distance
        let totalSteps = moveDistancePixels / (canvas.scene.grid.size / 10); // Using a smaller grid fraction for finer control
        let collisionDetected = false;
        let stepCounter = 0;
    
        for (let step = 1; step <= totalSteps; step++) {
            // Calculate the next step's potential position
            let nextX = target.x + directionVector.x * (canvas.scene.grid.size / 10) * step;
            let nextY = target.y + directionVector.y * (canvas.scene.grid.size / 10) * step;
            let nextPoint = new PIXI.Point(nextX, nextY);
            
            // Check for collision at this next step
            collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(target.center, nextPoint, {type:"move", mode:"any"});
            
            if (collisionDetected) {
                break; // Stop moving further if a collision is detected
            }
            stepCounter = step; // Update the step counter to the last successful step without a collision
        }
    
        // Calculate the final position to move the target to, based on the last step without a collision
        let finalX = target.x + directionVector.x * (canvas.scene.grid.size / 10) * stepCounter;
        let finalY = target.y + directionVector.y * (canvas.scene.grid.size / 10) * stepCounter;
        let distanceMovedInFeet = (stepCounter * (canvas.scene.grid.size / 10)) / pixelsPerFoot;
        // Update the target's position to the final calculated position
        if (stepCounter > 0) { // Ensure there was at least one step without collision
            await target.document.update({ x: finalX, y: finalY });
            let content = `The movement roll for ${target.actor.name} is ${directionResult}: ${target.actor.name} moves ${directionContent} using ${distanceMovedInFeet} feet of their movement before hitting an obstacle.`
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
        }
    }
}