import {mba} from "../../helperFunctions.js";

export async function jumping() {
    let target;
    if (!game.user._lastSelected) target = game.user.targets.first();
    else target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Need to select or target token!");
        return;
    }
    let choices = [["Distance Check", "check"], ["Animation", 'animation']];
    let selection = await mba.dialog("Jumping Helper", choices, `<b>What would you like to do?</b>`);
    if (!selection) return;
    if (selection === "animation") {
        let config = {
            size: target.w / canvas.grid.size,
            icon: target.document.texture.src,
            label: 'Leap',
            drawIcon: true,
            drawOutline: true,
            interval: target.data.width % 2 === 0 ? 1 : -1,
        }
        let position = await warpgate.crosshairs.show(config);
        if (position.cancelled == true) return;
        new Sequence()

            .effect()
            .file("jb2a.smoke.puff.ring.02.white")
            .atLocation(target)
            .scaleToObject(.75)
            .opacity(.5)
            .belowTokens()

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .file("jb2a.wind_stream.white")
            .anchor({ x: 0.5, y: .5 })
            .atLocation(target)
            .duration(1000)
            .opacity(2)
            .scale(target.w / canvas.grid.size * 0.025)
            .moveTowards(position)
            .mirrorX()
            .zIndex(1)

            .effect()
            .from(target)
            .atLocation(target)
            .opacity(1)
            .duration(1000)
            .anchor({ x: 0.5, y: 1.5 })
            .loopProperty("sprite", "position.y", { values: [50, 0, 50], duration: 500 })
            .loopProperty("sprite", "scale.x", { from: 1, to: 1.5, duration: 500, pingPong: true, delay: 0 })
            .loopProperty("sprite", "scale.y", { from: 1, to: 1.5, duration: 500, pingPong: true, delay: 0 })
            .moveTowards(position, { rotate: false })
            .zIndex(2)

            .effect()
            .from(target)
            .atLocation(target)
            .opacity(0.5)
            .scale(0.9)
            .belowTokens()
            .duration(1000)
            .anchor({ x: 0.5, y: 0.5 })
            .filter("ColorMatrix", { brightness: -1 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .moveTowards(position, { rotate: false })
            .zIndex(2)
            .waitUntilFinished()

            .animation()
            .on(target)
            .opacity(1)
            .teleportTo(position)
            .snapToGrid()
            .waitUntilFinished()

            .effect()
            .file("jb2a.smoke.puff.ring.02.white")
            .atLocation(target)
            .scaleToObject(2.5)
            .opacity(.5)
            .belowTokens()

            .play();

        return;
    }

    let athlete = mba.getItem(target.actor, "Athlete");
    let stepOfTheWind = mba.getItem(target.actor, "Ki: Step of the Wind");
    let bootsOfStridingAndSpringing = mba.getItem(target.actor, "Boots of Striding and Springing");
    let secondStoryWork = mba.getItem(target.actor, "Second Story Work");
    let remarkableAthlete = mba.getItem(target.actor, "Remarkable Athlete");
    let totemSpiritTiger = mba.getItem(target.actor, "Totem Spirit: Tiger");
    let jumpingSpell = mba.findEffect(target.actor, "Jump");

    let str = target.actor.system.abilities.str.value;
    let strMod = target.actor.system.abilities.str.mod;
    let height = (target.actor.flags["tidy5e-sheet"]?.height ? target.actor.flags["tidy5e-sheet"]?.height : "5'8''");
    let heightInches = inchesToFeet(height);

    let runningDistance = (athlete ? 5 : 10);

    let runningLongJump = (jumpingSpell ? str * 3 : str);
    let runningLongJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + (runningLongJump + runningLongJump) + "</span>" : "");
    let runningHighJump = (jumpingSpell ? (3 + strMod) * 3 : 3 + strMod);
    let runningHighJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + (runningHighJump + runningHighJump) + "</span>" : "");
    let runningReachJump = runningHighJump + (heightInches * 1.5);
    let runningReachJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + ((runningHighJump + runningHighJump) + (heightInches * 1.5)) + "</span>" : "");

    let obstacleHeight = runningLongJump / 4;
    let obstacleHeightWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + runningLongJump / 2 + "</span>" : "");

    let standingLongJump = runningLongJump / 2;
    let standingLongJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + (standingLongJump + standingLongJump) + "</span>" : "");
    let standingHighJump = runningHighJump / 2;
    let standingHighJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + (standingHighJump + standingHighJump) + "</span>" : "");
    let standingReachJump = standingHighJump + (heightInches * 1.5);
    let standingReachJumpWithStepOfTheWind = (stepOfTheWind ? "</span>/<span style='font-weight: bold;color: #1ca067;'>" + ((standingHighJump + standingHighJump) + (heightInches * 1.5)) + "</span>" : "");

    let feats = [];
    if (athlete) feats.push("Athlete");
    if (stepOfTheWind) feats.push("Step of the Wind");
    if (bootsOfStridingAndSpringing) feats.push("Boots of Striding and Springing");
    if (secondStoryWork) feats.push("Second Story Work");
    if (remarkableAthlete) feats.push("Remarkable Athlete");
    if (totemSpiritTiger) feats.push("Totem Spirit: Tiger");
    if (jumpingSpell) feats.push("Jump Spell");


    sendToChat(`
        <p>
            <b>Strength:</b> ${str}<br>
            <b>Height:</b> ${height}<br>
            <b>Active Modifiers:</b> ${feats}
        </p><p>
        <b>With a running start...</b><br>
        <i><small>(${runningDistance} feet of movement)</small></i><br>
        ...your long jump is <span style="font-weight: bold;color: #992200;">${runningLongJump}${runningLongJumpWithStepOfTheWind}</span> feet horizontally.<br>
        ...your high jump is <span style="font-weight: bold;color: #992200;">${runningHighJump}${runningHighJumpWithStepOfTheWind}</span> feet off the ground.<br>
        ...you can reach up and grab something <span style="font-weight: bold;color: #992200;">${runningReachJump}${runningReachJumpWithStepOfTheWind}</span> feet off the ground.<br>
        <br>
        <b>Without a running start...</b><br>
        ...your long jump is <span style="font-weight: bold;color: #992200;">${standingLongJump}${standingLongJumpWithStepOfTheWind}</span> feet horizontally.<br>
        ...your high jump is <span style="font-weight: bold;color: #992200;">${standingHighJump}${standingHighJumpWithStepOfTheWind}</span> feet off the ground.<br>
        ...you can reach up and grab something <span style="font-weight: bold;color: #992200;">${standingReachJump}${standingReachJumpWithStepOfTheWind}</span> feet off the ground.<br>
        <br>
        <b>If there are obstacles in the way...</b><br>
        ...you might need to make a DC 12 (Athletics) check to jump over them.<br>
        ...you cannot jump over any obstacles that are taller than <span style="font-weight: bold;color: #992200;">${obstacleHeight}</span>${obstacleHeightWithStepOfTheWind} feet.<br>
        <br>
        <b>If you land in difficult terrain...</b><br>
        ...you might need to make a DC 12 (Acrobatics) check or land prone.<br>
        <br>
        <b>In all circumstances...</b><br>
        ...you cannot jump farther than your remaining movement. You might need to Dash to cover long distances.<br>
        ...your DM might allow you to push beyond your limits with a Strength (Athletics) check.
        </p>
    `)

    function sendToChat(contentToSend) {
        ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({ token: target.actor }), content: "<small>" + contentToSend + "</small>" });
    }

    function inchesToFeet(value) {
        //isolate the number before the ' mark
        var beforeTick = value.replace(/'.*$/, '');
        //the first replace eliminates trailing ' or '' or " marks
        //the second removes the first value and the foot tick
        var afterTick = value.replace((/''|"/), '').replace(/.*'/, '');
        //the + before afterTick converts the string back into an int
        return +beforeTick + (afterTick / 12);
    }
}