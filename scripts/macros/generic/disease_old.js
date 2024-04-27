async function creator({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(game.user.targets);
    if (!targets.length) {
        ui.notifications.warn('No target selected!');
        return;
    }
    let targetActor = targets[0].actor;
    let choices = [
        ['Arcane Blight (RotF)', 'arcane_blight'],
        ['Blinding Sickness (PHB)', 'blinding_sickness'],
        ['Blue Mist Fever (ToA)', 'blue_mist_fever'],
        ['Blue Rot (GoS)', 'blue_rot'],
        ['Cackle Fever (DMG)', 'cackle_fever'],
        ['Filth Fever (PHB)', 'filth_fever'],
        ['Flesh Rot (PHB)', 'flesh_rot'],
        ['Mindfire (PHB)', 'mindfire'],
        ['Seizure (PHB)', 'seizure'],
        ['Sewer Plague (DMG)', 'sewer_plague'],
        ['Shivering Sickness (ToA)', 'shivering_sickness'],
        ['Sight Rot (DMG)', 'sight_rot'],
        ['Slimy Doom (PHB)', 'slimy_doom'],
        ['Throat Leeches (ToA)', 'throat_leeches']
    ]
    let selection = await chrisPremades.helpers.dialog('Choose Disease to apply:', choices);
    if (!selection) return;
    let isDiseased;
    let description = [];
    let effectData;
    switch (selection) {
        //Partially done; needs testing; does not spread the disease when triggered in 10ft; add animation from tasha's hideous laughter;
        case "cackle_fever": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Cackle Fever!');
                return;
            }
            let cackleFeverRoll = await new Roll("1d4").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(cackleFeverRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Cackle Fever. Symptoms will manifest in ${cackleFeverRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>This disease targets humanoids, although gnomes are strangely immune. While in the grips of this disease, victims frequently succumb to fits of mad laughter, giving the disease its common name and its morbid nickname: 'the shrieks'</p>
                <p>Any event that causes the infected creature great stress—including entering combat, taking damage, experiencing fear, or having a nightmare — forces the creature to make a DC 13 Constitution saving throw.</p>
                <p>On a failed save, the creature takes 5 (1d10) psychic damage and becomes incapacitated with mad laughter for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the mad laughter and the incapacitated condition on a success. Any humanoid creature that starts its turn within 10 feet of an infected creature in the throes of mad laughter must succeed on a DC 10 Constitution saving throw or also become infected with the disease. Once a creature succeeds on this save, it is immune to the mad laughter of that particular infected creature for 24 hours.</p>
                <p>At the end of each long rest, an infected creature can make a DC 13 Constitution saving throw. On a successful save, the DC for this save and for the save to avoid an attack of mad laughter drops by 1d6. When the saving throw DC drops to 0, the creature recovers from the disease. A creature that fails three of these saving throws gains a randomly determined form of indefinite madness.</p>
                `
            ]);
            async function effectMacroCackleFeverManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                if (!effects.length) {
                    console.log('Unable to find effect (Cackle Fever)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                    if (!effects.length) {
                        console.log('Unable to find effect (Cackle Fever)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroCackleFeverCombatStart() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
                        if (isIncapacitated) return;
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) return;
                        let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
                        await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
                        cackleFeverDamageRoll.toMessage({
                            rollMode: 'roll',
                            speaker: { 'alias': name },
                            flavor: `<b>Cackle Fever</b>`
                        });
                        await chrisPremades.helpers.applyDamage(token, cackleFeverDamageRoll.total, 'psychic');
                        let effectData = {
                            'name': "Uncontrollable Cackling",
                            'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
                            'duration': {
                                'seconds': 60
                            },
                            'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
                            'changes': [
                                {
                                    'key': 'macro.CE',
                                    'mode': 0,
                                    'value': 'Incapacitated',
                                    'priority': 20
                                },
                                {
                                    'key': 'flags.midi-qol.OverTime',
                                    'mode': 0,
                                    'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                                    'priority': 20
                                }
                            ],

                        };
                        await chrisPremades.helpers.createEffect(actor, effectData);
                    }
                    async function effectMacroCackleFeverFrightened() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let isFrightened = await chrisPremades.helpers.findEffect(actor, "Frightened");
                        if (!isFrightened) return;
                        let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
                        if (isIncapacitated) return;
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) return;
                        let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
                        await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
                        cackleFeverDamageRoll.toMessage({
                            rollMode: 'roll',
                            speaker: { 'alias': name },
                            flavor: `<b>Cackle Fever</b>`
                        });
                        await chrisPremades.helpers.applyDamage(token, cackleFeverDamageRoll.total, 'psychic');
                        let effectData = {
                            'name': "Uncontrollable Cackling",
                            'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
                            'duration': {
                                'seconds': 60
                            },
                            'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
                            'changes': [
                                {
                                    'key': 'macro.CE',
                                    'mode': 0,
                                    'value': 'Incapacitated',
                                    'priority': 20
                                },
                                {
                                    'key': 'flags.midi-qol.OverTime',
                                    'mode': 0,
                                    'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                                    'priority': 20
                                }
                            ],

                        };
                        await chrisPremades.helpers.createEffect(actor, effectData);
                    }
                    async function effectMacroCackleFeverRest() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let fails = effect.flags['mba-premades']?.fails;
                        let newSaveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) {
                            let cackleFeverRoll = await new Roll("1d6").roll({ 'async': true });
                            await MidiQOL.displayDSNForRoll(cackleFeverRoll, 'damageRoll');
                            newSaveDC = saveDC - cackleFeverRoll.total;
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: `
                                    <p><b>Cackle Fever: ` + token.document.name + `</b></p>
                                    <p></p>
                                    <p>Fails: <b>${fails}</b></p>
                                    <p>Old DC: <b>${saveDC}</b></p>
                                    <p>Roll Result: <b>${cackleFeverRoll.total}</b></p>
                                    <p>New DC: <b>${newSaveDC}</b></p>
                                `,
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                        }
                        if (saveRoll.total < saveDC) {
                            fails += 1;
                            newSaveDC = saveDC;
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: `
                                    <p><b>Cackle Fever: ` + token.document.name + `</b></p>
                                    <p></p>
                                    <p>Fails: <b>${fails}</b></p>
                                    <p>Save DC: <b>${newSaveDC}</b></p>
                                `,
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                        }
                        let updates = {
                            'flags': {
                                'mba-premades': {
                                    'saveDC': newSaveDC,
                                    'fails': fails
                                }
                            }
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                        if (effect.flags['mba-premades']?.fails > 2) {
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: "<b>" + targets[0].document.name + "</b> failed the save against Cackle Fever 3 times and gains a randomly determined form of <b>Indefinite Madness!</b>",
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                            await chrisPremades.helpers.removeEffect(effect);
                        }
                        if (effect.flags['mba-premades']?.saveDC < 1) {
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: "<b>" + token.document.name + "</b> is cured from Cackle Fever! (Save DC dropped to 0)",
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                            await chrisPremades.helpers.removeEffect(effect);
                        }
                    }
                    async function effectMacroCackleFeverDel() {
                        let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                        let level = +exhaustion[0].name.slice(-1);
                        if (level === 1) {
                            await chrisPremades.helpers.removeCondition(actor, "Exhaustion 1");
                            return;
                        }
                        level -= 1;
                        await chrisPremades.helpers.addCondition(actor, "Exhaustion " + level);
                    }
                    effectData = {
                        'name': "Unknown Disease 5",
                        'changes': [
                            {
                                'key': 'flags.midi-qol.onUseMacroName',
                                'mode': 0,
                                'value': 'function.mbaPremades.macros.disease.cackleFeverDamaged,isDamaged',
                                'priority': 20
                            }
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverRest)
                                },
                                'onCombatStart': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverCombatStart)
                                },
                                'onTurnStart': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverFrightened)
                                },
                                'onDelete': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverDel)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Cackle Fever",
                                'description': description,
                                'saveDC': 13,
                                'fails': 0
                            }
                        }
                    };
                    let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                    if (!exhaustion.length) {
                        await chrisPremades.helpers.addCondition(actor, "Exhaustion 1");
                        await chrisPremades.helpers.createEffect(actor, effectData);
                        await chrisPremades.helpers.removeEffect(effect);
                        return;
                    }
                    let level = +exhaustion[0].name.slice(-1);
                    level += 1;
                    if (level > 6) level = 6;
                    await chrisPremades.helpers.addCondition(actor, "Exhaustion " + level);
                    await chrisPremades.helpers.createEffect(actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 5",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Cackle Fever",
                        'description': description,
                        'roll': cackleFeverRoll.total,
                    }
                }
            };
            break;
        }
        //Done, not tested; automovement is commented
        case "mindfire": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Mindfire");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Mindfire!');
                return;
            }
            description.push([
                `
                <p>The creature's mind becomes feverish.</p>
                <p>The creature has disadvantage on Intelligence checks and Intelligence saving throws, and the creature behaves as if under the effects of the confusion spell during combat.</p>
                `
            ]);
            async function effectMacroMindfire() {
                await chrisPremades.helpers.addCondition(actor, "Reaction");
                let mindfireRoll = await new Roll("1d10").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(mindfireRoll, 'damageRoll');
                if (mindfireRoll.total === 1) {
                    let directionRoll = await new Roll("1d8").roll({ 'async': true });
                    await MidiQOL.displayDSNForRoll(directionRoll, 'damageRoll');
                    const directionResult = directionRoll.total;
                    const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
                    const directionContent = directions[directionResult - 1];
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p>Direction roll: <b>${directionRoll.total}</b></p><p><b>${token.document.name}</b> uses all its movement to move in ${directionContent} direction</p>`,
                        speaker: { actor: token.actor }
                    });
                    /*
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
                else if (mindfireRoll.total < 7) {
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn.</p>`,
                        speaker: { actor: token.actor }
                    });
                }
                else if (mindfireRoll.total < 9) {
                    const rangeCheck = MidiQOL.findNearby(null, token, token.actor.system.attributes.movement.walk, { includeToken: false });
                    if (rangeCheck.length > 0) {
                        const randomSelection = rangeCheck[Math.floor(Math.random() * rangeCheck.length)];
                        let target = randomSelection;
                        ChatMessage.create({
                            content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> must move to <b>${randomSelection.actor.name}</b> and attack them with a melee attack.</p>`,
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
                            content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>`,
                            speaker: { actor: token.actor }
                        });
                    }
                }
                else {
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> can act normally.</p>`,
                        speaker: { actor: token.actor }
                    });
                }
            }
            effectData = {
                'name': "Unknown Disease 8",
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.check.int',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.save.int',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onTurnStart': {
                            'script': chrisPremades.helpers.functionToString(effectMacroMindfire)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Mindfire",
                        'description': description
                    }
                }
            };
            break;
        }
        //Partially done: doesn't cut the long rest regen and doesn't account for half regen from hit die rolls; update when Exhaustion AE can be 6+
        case "sewer_plague": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Sewer Plague!');
                return;
            }
            let sewerPlagueRoll = await new Roll("1d4").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(sewerPlagueRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Sewer Plague. Symptoms will manifest in ${sewerPlagueRoll.total} days.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>Sewer plague is a generic term for a broad category of illnesses that incubate in sewers, refuse heaps, and stagnant swamps, and which are sometimes transmitted by creatures that dwell in those areas, such as rats and otyughs.</p>
                <p>When a humanoid creature is bitten by a creature that carries the disease, or when it comes into contact with filth or offal contaminated by the disease, the creature must succeed on a DC 11 Constitution saving throw or become infected.</p>
                <p>It takes 1d4 days for sewer plague's symptoms to manifest in an infected creature. Symptoms include fatigue and cramps. The infected creature suffers one level of exhaustion, and it regains only half the normal number of hit points from spending Hit Dice and no hit points from finishing a long rest.</p>
                <p>At the end of each long rest, an infected creature must make a DC 11 Constitution saving throw. On a failed save, the character gains one level of exhaustion.</p><p>On a successful save, the character's exhaustion level decreases by one level. If a successful saving throw reduces the infected creature's level of exhaustion below 1, the creature recovers from the disease.</p>
                `
            ]);
            async function effectMacroSewerPlagueManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                if (!effects.length) {
                    console.log('Unable to find effect (Sewer Plague)');
                    return;
                }
                let daysToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ days: daysToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                    if (!effects.length) {
                        console.log('Unable to find effect (Sewer Plague)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroSewerPlague() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                        if (!effects.length) {
                            console.log('Unable to find effect (Sewer Plague)');
                            return;
                        }
                        let effect = effects[0];
                        let currentExhaustion = effect.flags['mba-premades']?.currentExhaustion;
                        let saveDC = 11;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < saveDC) {
                            await chrisPremades.helpers.removeCondition(token.actor, "Exhaustion " + currentExhaustion);
                            currentExhaustion += 1;
                            if (currentExhaustion > 6) currentExhaustion = 6; // temp workaround
                            await chrisPremades.helpers.addCondition(token.actor, "Exhaustion " + currentExhaustion);
                            let updates = {
                                'flags': {
                                    'mba-premades': {
                                        'currentExhaustion': currentExhaustion
                                    }
                                }
                            };
                            await chrisPremades.helpers.updateEffect(effect, updates);
                            return;
                        }
                        if (saveRoll.total >= saveDC && currentExhaustion > 1) {
                            await chrisPremades.helpers.removeCondition(token.actor, "Exhaustion " + currentExhaustion);
                            currentExhaustion -= 1;
                            await chrisPremades.helpers.addCondition(token.actor, "Exhaustion " + currentExhaustion);
                            let updates = {
                                'flags': {
                                    'mba-premades': {
                                        'currentExhaustion': currentExhaustion
                                    }
                                }
                            };
                            await chrisPremades.helpers.updateEffect(effect, updates);
                            return;
                        }
                        if (saveRoll.total >= saveDC && currentExhaustion === 1) await chrisPremades.helpers.removeEffect(effect);
                    }
                    async function effectMacroSewerPlagueDel() {
                        let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                        if (!exhaustion.length) return
                        await chrisPremades.helpers.removeEffect(exhaustion[0]);
                    }
                    let effectData = {
                        'name': "Unknown Disease 10",
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroSewerPlague)
                                },
                                'onDelete': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroSewerPlagueDel)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Sewer Plague",
                                'description': description,
                                'currentExhaustion': 1
                            }
                        }
                    };
                    await chrisPremades.helpers.addCondition(token.actor, "Exhaustion 1");
                    await chrisPremades.helpers.createEffect(token.actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 10",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroSewerPlagueManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Sewer Plague",
                        'description': description,
                        'roll': sewerPlagueRoll.total
                    }
                }
            };
            break;
        }
        //Partially done: doesn't cut the long rest regen and doesn't account for half regen from hit die rolls;
        case "shivering_sickness": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Shivering Sickness!');
                return;
            }
            let shiveringSicknessRoll = await new Roll("2d6").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(shiveringSicknessRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Shivering Sickness. Symptoms will manifest in ${shiveringSicknessRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>Insects native to the jungles and marshes of Chult carry this disease, shivering sickness. A giant or humanoid that takes damage from insect swarms or from giant centipedes, giant scorpions, or giant wasps is exposed to the disease at the end of the encounter. Those who haven't applied insect repellent since their previous long rest are exposed to the disease when they finish a long rest.</p>
                <p>Creature exposed to the Shivering Sickness must succeed on a DC 11 Constitution saving throw or become infected. A creature with natural armor has advantage on the saving throw. It takes 2d6 hours for symptoms to manifest in an infected creature. Symptoms include blurred vision, disorientation, and a sudden drop in body temperature that causes uncontrollable shivering and chattering of the teeth.</p>
                <p>Once symptoms begin, the infected creature regains only half the normal number of hit points from spending Hit Dice and no hit points from a long rest. The infected creature also has disadvantage on ability checks and attack rolls. At the end of a long rest, an infected creature repeats the saving throw, shaking off the disease on a successful save.</p>
                `
            ]);
            async function effectMacroShiveringSicknessManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                if (!effects.length) {
                    console.log('Unable to find effect (Shivering Sickness)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                    if (!effects.length) {
                        console.log('Unable to find effect (Shivering Sickness)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroShiveringSickness() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                        if (!effects.length) {
                            console.log('Unable to find effect (Shivering Sickness)');
                            return;
                        }
                        let effect = effects[0];
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < 11) return;
                        await chrisPremades.helpers.removeEffect(effect);
                    }
                    let effectData = {
                        'name': "Unknown Disease 11",
                        'changes': [
                            {
                                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                                'mode': 2,
                                'value': 1,
                                'priority': 20
                            },
                            {
                                'key': 'flags.midi-qol.disadvantage.attack.all',
                                'mode': 2,
                                'value': 1,
                                'priority': 20
                            }
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroShiveringSickness)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Shivering Sickness",
                                'description': description,
                            }
                        }
                    };
                    await chrisPremades.helpers.createEffect(actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 11",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroShiveringSicknessManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Shivering Sickness",
                        'description': description,
                        'roll': shiveringSicknessRoll.total
                    }
                }
            };
            break;
        }
    }
    await chrisPremades.helpers.createEffect(targetActor, effectData);
}

async function cackleFeverDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
    if (!effects.length) {
        console.log('Unable to find effect (Cackle Fever)');
        return;
    }
    let effect = effects[0];
    let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
    if (isIncapacitated) return;
    let saveDC = effect.flags['mba-premades']?.saveDC;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
    if (saveRoll.total >= saveDC) return;
    let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
    cackleFeverDamageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: `<b>Cackle Fever</b>`
    });
    let damageTotal = cackleFeverDamageRoll.total;
    workflow.damageItem.damageDetail[0].push({ 'damage': damageTotal });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
    let effectData = {
        'name': "Uncontrollable Cackling",
        'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
        'duration': {
            'seconds': 60
        },
        'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                'priority': 20
            }
        ],

    };
    await chrisPremades.helpers.createEffect(actor, effectData);
}