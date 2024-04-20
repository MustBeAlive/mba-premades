// To do: animations, effect description
export async function confusion({ speaker, actor, token, character, item, args, scope, workflow }) {
    let radius = (workflow.castData.castLevel - 2) * 5;
    let templateData = {
        't': 'circle',
        'user': game.user,
        'distance': radius,
        'direction': 0,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'midi-qol': {
                'originUuid': workflow.item.uuid
            },
            'walledtemplates': {
                'wallRestriction': 'move',
                'wallsBlock': 'recurse',
            }
        },
        'angle': 0
    };
    let template = await chrisPremades.helpers.placeTemplate(templateData);
    if (!template) return;
    let targetUuids = [];
    for (let i of game.user.targets) targetUuids.push(i.document.uuid);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Confusion: Delusions', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        await chrisPremades.helpers.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    async function effectMacroConfusion() {
        await chrisPremades.helpers.addCondition(actor, "Reaction");
        let confusionRoll = await new Roll("1d10").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(confusionRoll, 'damageRoll');
        if (confusionRoll.total === 1) {
            let directionRoll = await new Roll("1d8").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(directionRoll, 'damageRoll');
            const directionResult = directionRoll.total;
            const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
            const directionContent = directions[directionResult - 1];
            ChatMessage.create({
                content: `<p>Roll result: <b>${confusionRoll.total}</b></p><p>Direction roll: <b>${directionRoll.total}</b></p><p><b>${token.document.name}</b> uses all its movement to move in ${directionContent} direction</p>`,
                speaker: { actor: token.actor }
            });
            /* Auto Token Move Block, uncomment to make it work
            const walkSpeedFeet = token.actor.system.attributes.movement.walk;
            const gridDistance = canvas.dimensions.distance; // Feet per grid cell
            const pixelsPerFoot = canvas.scene.grid.size / gridDistance;
            const moveDistancePixels = walkSpeedFeet * pixelsPerFoot;
            const diagonalMultiplier = Math.SQRT2;
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
                case "North-West":
                    moveX = -moveDistancePixels / diagonalMultiplier;
                    moveY = -moveDistancePixels / diagonalMultiplier;
                    break;
                case "North-East":
                    moveX = moveDistancePixels / diagonalMultiplier;
                    moveY = -moveDistancePixels / diagonalMultiplier;
                    break;
                case "South-West":
                    moveX = -moveDistancePixels / diagonalMultiplier;
                    moveY = moveDistancePixels / diagonalMultiplier;
                    break;
                case "South-Eeast":
                    moveX = moveDistancePixels / diagonalMultiplier;
                    moveY = moveDistancePixels / diagonalMultiplier;
                    break;
            }
            const newX = token.x + moveX;
            const newY = token.y + moveY;
            let endPoint = new PIXI.Point(newX, newY);
            let collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(token.center, endPoint, { type: "move", mode: "any" });
            if (!collisionDetected) {
                await token.document.update({ x: newX, y: newY });
                content1 = `The movement roll for ${token.actor.name} is ${directionResult}: ${token.actor.name} moves ${directionContent} using all (${token.actor.system.attributes.movement.walk} feet) of their movement. The creature doesn't take an action this turn.`
            }
            else {
                // Calculate the direction vector based on the intended direction
                let directionVector = { x: moveX, y: moveY };
                let magnitude = Math.hypot(directionVector.x, directionVector.y);
                // Normalize the direction vector
                directionVector.x /= magnitude;
                directionVector.y /= magnitude;
    
                // Calculate the number of steps based on the total intended movement distance
                let totalSteps = moveDistancePixels / (canvas.scene.grid.size / 10);
                let collisionDetected = false;
                let stepCounter = 0;
    
                for (let step = 1; step <= totalSteps; step++) {
                    // Calculate the next step's potential position
                    let nextX = token.x + directionVector.x * (canvas.scene.grid.size / 10) * step;
                    let nextY = token.y + directionVector.y * (canvas.scene.grid.size / 10) * step;
                    let nextPoint = new PIXI.Point(nextX, nextY);
    
                    // Check for collision at this next step
                    collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(token.center, nextPoint, { type: "move", mode: "any" });
    
                    if (collisionDetected) {
                        break; // Stop moving further if a collision is detected
                    }
                    stepCounter = step; // Update the step counter to the last successful step without a collision
                }
    
                // Calculate the final position to move the token to, based on the last step without a collision
                let finalX = token.x + directionVector.x * (canvas.scene.grid.size / 10) * stepCounter;
                let finalY = token.y + directionVector.y * (canvas.scene.grid.size / 10) * stepCounter;
    
                let distanceMovedInFeet = (stepCounter * (canvas.scene.grid.size / 10)) / pixelsPerFoot;
    
                if (stepCounter > 0) { // Ensure there was at least one step without collision
                    await token.document.update({ x: finalX, y: finalY });
                    content1 = `The movement roll for ${token.actor.name} is ${directionResult}: ${token.actor.name} moves ${directionContent} using ${distanceMovedInFeet} feet of their movement before hitting an obstacle. The creature doesn't take an action this turn.`
                } else {
                    content1 = `The movement for ${token.actor.name} does not occur because the way is blocked. The creature doesn't take an action this turn.`
                }
            }
            */
        }
        else if (confusionRoll.total < 7) {
            ChatMessage.create({
                content: `<p>Roll result: <b>${confusionRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn.</p>`,
                speaker: { actor: token.actor }
            });
        }
        else if (confusionRoll.total < 9) {
            const rangeCheck = MidiQOL.findNearby(null, token, token.actor.system.attributes.movement.walk, { includeToken: false });
            if (rangeCheck.length > 0) {
                const randomSelection = rangeCheck[Math.floor(Math.random() * rangeCheck.length)];
                let target = randomSelection;
                ChatMessage.create({
                    content: `<p>Roll result: <b>${confusionRoll.total}</b></p><p><b>${token.document.name}</b> must move to <b>${randomSelection.actor.name}</b> and attack them with a melee attack.</p>`,
                    speaker: { actor: token.actor }
                });
                new Sequence()

                    .effect()
                    .from(target)
                    .belowTokens()
                    .attachTo(target, { locale: true })
                    .scaleToObject(1, { considerTokenScale: true })
                    .spriteRotation(target.rotation * -1)
                    .filter("Glow", { color: 0x911a1a, distance: 20 })
                    .duration(17500)
                    .fadeIn(1000, { delay: 1000 })
                    .fadeOut(3500, { ease: "easeInSine" })
                    .opacity(0.75)
                    .zIndex(0.1)
                    .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.25], duration: 1500, pingPong: true, delay: 500 })

                    .effect()
                    .file("jb2a.extras.tmfx.outflow.circle.01")
                    .attachTo(target, { locale: true })
                    .scaleToObject(1.5, { considerTokenScale: false })
                    .randomRotation()
                    .duration(17500)
                    .fadeIn(4000)
                    .fadeOut(3500, { ease: "easeInSine" })
                    .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                    .tint(0x870101)
                    .opacity(0.5)
                    .belowTokens()
                    .play()
            }
            else {
                ChatMessage.create({
                    content: `<p>Roll result: <b>${confusionRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>`,
                    speaker: { actor: token.actor }
                });
            }
        }
        else {
            ChatMessage.create({
                content: `<p>Roll result: <b>${confusionRoll.total}</b></p><p><b>${token.document.name}</b> can act normally.</p>`,
                speaker: { actor: token.actor }
            });
        }
    }
    async function effectMacroConfusionDel() {
        let effect = await chrisPremades.helpers.findEffect(actor, "Reaction");
        if (!effect) return;
        await chrisPremades.helpers.removeEffect(effect);
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by delusions, which provoke uncontrolled action. You can't take reactions and must roll a d10 at the start of each of your turns to determine your behaviour:</p>
            <p><b>1:</b> You use all of your movement to move in a random direction, which will be determined by a d8 roll. You don't take any other actions this turn.</p>
            <p><b>2-6:</b> You don't move or take actions this turn.</p>
            <p><b>7-8:</b> You must use your action to make a melee attack against a randomly determined target within your reach. If there is no targets within your reach, you do nothing this turn.</p>
            <p><b>9-10</b> You can act normally.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ', saveMagic=true, name=Confusion: Turn End',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacroConfusion)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroConfusionDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let i of featureWorkflow.failedSaves) {
        await chrisPremades.helpers.createEffect(i.actor, effectData);
        let newEffect = await chrisPremades.helpers.findEffect(i.actor, "Confusion");
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
}