import {mba} from "../../../helperFunctions.js";

export async function counterspell({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let level = workflow.castData.castLevel;
    let choices = [
        ["Level 1", 1],
        ["Level 2", 2],
        ["Level 3", 3],
        ["Level 4", 4],
        ["Level 5", 5],
        ["Level 6", 6],
        ["Level 7", 7],
        ["Level 8", 8],
        ["Level 9", 9]
    ];
    await mba.playerDialogMessage(mba.firstOwner(target));
    let selection = await mba.remoteDialog(workflow.item.name, choices, mba.firstOwner(target).id, "What is the level of the spell you are attempting to cast?");
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        ui.notification.warn("Target failed to choose spell level, try again");
        return;
    }
    if (level >= selection) {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.ball")
            .attachTo(token)
            .scaleToObject(2)
            .belowTokens()
            .fadeIn(1000)
            .noLoop()
            .waitUntilFinished(-1400)

            .effect()
            .file("jb2a.energy_beam.normal.bluepink.02")
            .attachTo(token)
            .stretchTo(target)
            .scaleIn(0, 3000, { ease: "easeOutExpo" })
            .fadeIn(500)
            .duration(2500)
            .fadeOut(500)

            .effect()
            .file("jb2a.energy_attack.01.dark_purple")
            .delay(500)
            .attachTo(target)
            .scaleToObject(2.2)

            .play()

        ChatMessage.create({
            content: `<p><b>${workflow.token.document.name}'s</b> counterspell is successful against <b>${target.document.name}'s</b> spell!</p>`,
            speaker: { actor: workflow.actor }
        });
        return;
    }
    let ability = workflow.actor.system.attributes.spellcasting;
    let roll = await mba.rollRequest(workflow.token, 'abil', ability);
    if (roll.total >= (10 + selection)) {
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.ball")
            .attachTo(token)
            .scaleToObject(2)
            .belowTokens()
            .fadeIn(1000)
            .noLoop()
            .waitUntilFinished(-1400)

            .effect()
            .file("jb2a.energy_beam.normal.bluepink.02")
            .attachTo(token)
            .stretchTo(target)
            .scaleIn(0, 3000, { ease: "easeOutExpo" })
            .fadeIn(500)
            .duration(2500)
            .fadeOut(500)

            .effect()
            .file("jb2a.energy_attack.01.dark_purple")
            .delay(500)
            .attachTo(target)
            .scaleToObject(2.2)

            .play()

        ChatMessage.create({
            content: `<p><b>${workflow.token.document.name}'s</b> counterspell is successful against <b>${target.document.name}'s</b> spell!</p>`,
            speaker: { actor: workflow.actor }
        });
        return;
    }
    let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
    let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.ball")
        .attachTo(token)
        .scaleToObject(2)
        .belowTokens()
        .fadeIn(1000)
        .noLoop()
        .waitUntilFinished(-1400)

        .effect()
        .file("jb2a.energy_beam.normal.bluepink.02")
        .attachTo(token)
        .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .scaleIn(0, 3000, { ease: "easeOutExpo" })
        .fadeIn(500)
        .duration(2500)
        .fadeOut(500)

        .effect()
        .file("jb2a.energy_attack.01.dark_purple")
        .delay(500)
        .attachTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .scaleToObject(2.2)

        .play()
        
    ChatMessage.create({
        content: `<p><b>${workflow.token.document.name}'s</b> failed to counterspell <b>${target.document.name}'s</b> spell!</p>`,
        speaker: { actor: workflow.actor }
    });
}