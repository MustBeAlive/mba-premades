import {mba} from "../../../helperFunctions.js";

export async function teleport({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Permanent Circle", "safe"],
        ["Associated Object (ex: book from a library)", "safe"],
        ["Very Familiar (been often)", "low"],
        ["Seen Casually (been more than once)", "mid"],
        ["Viewed Once (self explanatory)", "high"],
        ["Description (ex: know from a map)", "high"],
        ["False Destination (place does not exist)", "danger"]
    ];
    await mba.gmDialogMessage();
    let failChance = await mba.remoteDialog("Teleport", choices, game.users.activeGM.id, `How familiar is ${workflow.token.document.name} with teleport destination?`);
    await mba.clearGMDialogMessage();
    if (!failChance) return;
    let targets = Array.from(workflow.targets);
    new Sequence()

        .effect()
        .file("jb2a.particles.outward.blue.01.05")
        .atLocation(workflow.token)
        .scaleToObject(1.7)
        .duration(5500)
        .fadeIn(3000, { ease: "easeInExpo" })
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .effect()
        .file("jb2a.particles.outward.blue.01.05")
        .atLocation(workflow.token)
        .scaleToObject(4)
        .duration(5500)
        .fadeIn(3000, { ease: "easeInExpo" })
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.intro.blue")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .opacity(0.8)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -0.25, brightness: 1 })
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.loop.blue")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .duration(2500)
        .opacity(0.65)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -0.5, brightness: 1.5 })

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02.fast")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .duration(2500)
        .opacity(0.5)

        .animation()
        .on(workflow.token)
        .delay(2000)
        .opacity(0)

        .thenDo(async () => {
            for (let target of targets) {
                new Sequence()

                    .animation()
                    .on(target)
                    .delay(2000)
                    .opacity(0)

                    .effect()
                    .from(target)
                    .atLocation(target)
                    .attachTo(target, { bindAlpha: false })
                    .scaleToObject(1.1)
                    .duration(2500)
                    .fadeIn(2000, { ease: "easeInExpo" })
                    .filter("ColorMatrix", { saturate: -1, brightness: 10 })
                    .filter("Blur", { blurX: 5, blurY: 10 })
                    .scaleOut(0, 100, { ease: "easeOutCubic" })
                    .waitUntilFinished(-200)

                    .play();
            }
        })

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1.1)
        .duration(2500 + 500)
        .fadeIn(2000, { ease: "easeInExpo" })
        .fadeOut(100)
        .scaleOut(0, 100, { ease: "easeOutCubic" })
        .animateProperty("sprite", "scale.x", { from: 0.5, to: 0, duration: 500, delay: 2500, ease: "easeOutElastic" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -1000, duration: 500, delay: 2500, ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .waitUntilFinished(-700)

        .effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/energy/energy_pulse_yellow_CIRCLE.webm")
        .atLocation(workflow.token)
        .scaleToObject(4)
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, hue: 160, brightness: 2 })

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.loop.blue")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .duration(10000)
        .fadeOut(5000, { ease: "easeOutQuint" })
        .opacity(0.3)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })

        .effect()
        .file("jb2a.particles.outward.blue.01.05")
        .atLocation(workflow.token)
        .scaleToObject(5)
        .duration(10000)
        .fadeIn(250, { ease: "easeOutQuint" })
        .fadeOut(5000, { ease: "easeOutQuint" })
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })

        .play()

    let teleportationRoll = await new Roll("1d100").roll({ 'async': true });
    let result = teleportationRoll.total;
    let consequences;
    await MidiQOL.displayDSNForRoll(teleportationRoll);
    if (failChance === "safe" || (failChance === "low" && result > 25) || (failChance === "mid" && result > 54) || (failChance === "high" && result > 74)) {
        consequences = "On Target";
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Roll Total: ${result}</p>
                <p>Consequences: ${consequences}</p>
            `,
            speaker: { alias: "MBA Premades: Teleport" }
        });
    }
    else if (failChance === "low" && result < 25) {
        if (result >= 14 && result < 25) consequences = "Teleport off Target Location";
        else if (result >= 6 && result < 14) consequences = "Teleport to Similar Area";
        else if (result >= 1 && result < 6) consequences = "Mishap";
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Roll Total: ${result}</p>
                <p>Consequences: ${consequences}</p>
            `,
            speaker: { alias: "MBA Premades: Teleport" }
        });
    }
    else if (failChance === "mid" && result < 54) {
        if (result >= 44 && result < 54) consequences = "Teleport off Target Location";
        else if (result >= 34 && result < 44) consequences = "Teleport to Similar Area";
        else if (result >= 1 && result < 34) consequences = "Mishap";
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Roll Total: ${result}</p>
                <p>Consequences: ${consequences}</p>
            `,
            speaker: { alias: "MBA Premades: Teleport" }
        });
    }
    else if (failChance === "high" && result < 74) {
        if (result >= 54 && result < 74) consequences = "Teleport off Target Location";
        else if (result >= 44 && result < 54) consequences = "Teleport to Similar Area";
        else if (result >= 1 && result < 44) consequences = "Mishap";
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Roll Total: ${result}</p>
                <p>Consequences: ${consequences}</p>
            `,
            speaker: { alias: "MBA Premades: Teleport" }
        });
    }
    else if (failChance === "fail") {
        if (result >= 51 ) consequences = "Teleport to Similar Area";
        else if (result < 51) consequences = "Mishap";
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Roll Total: ${result}</p>
                <p>Consequences: ${consequences}</p>
            `,
            speaker: { alias: "MBA Premades: Teleport" }
        });
    }
}
