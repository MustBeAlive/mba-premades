import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function summonDemon({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.intro.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .fadeOut(1000)
        .playbackRate(1.4)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.loop.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .delay(2000)
        .zIndex(2)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} SumDem`)

        .play()

    let choices = [["Summon Quasit", "quasit"], ["Attempt to Summon Shadow Demon (1d100)", "shadow"]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Summon Demon", choices, "<b>What would you like to do?</b>");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let sourceActor;
    let tokenName
    if (selection === "quasit") {
        sourceActor = game.actors.getName("FF: Quasit");
        if (!sourceActor) {
            ui.notifications.warn("Unale to find actor! (FF: Quasit)");
            new Sequence()

                .effect()
                .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
                .attachTo(workflow.token, { followRotation: false })
                .size(4, { gridUnits: true })
                .zIndex(3)
                .belowTokens()

                .wait(400)

                .thenDo(async () => {
                    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
                })

                .play()

            return;
        }
        tokenName = "Drow Mage Quasit";
    }
    else if (selection === "shadow") {
        let shadowRoll = await new Roll("1d100").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(shadowRoll);
        if (shadowRoll.total <= 49) {
            ui.notifications.info("Attempt fails!");
            new Sequence()

                .effect()
                .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
                .attachTo(workflow.token, { followRotation: false })
                .size(4, { gridUnits: true })
                .zIndex(3)
                .belowTokens()

                .wait(400)

                .thenDo(async () => {
                    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
                })

                .play()

            return;
        }
        sourceActor = game.actors.getName("Shadow Demon");
        if (!sourceActor) {
            ui.notifications.warn("Unale to find actor! (Shadow Demon)");
            new Sequence()

                .effect()
                .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
                .attachTo(workflow.token, { followRotation: false })
                .size(4, { gridUnits: true })
                .zIndex(3)
                .belowTokens()

                .wait(400)

                .thenDo(async () => {
                    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
                })

                .play()
            
            return;
        }
        tokenName = "Drow Mage Shadow Demon";
    }
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
        }
    };
    await mba.gmDialogMessage();
    await tashaSummon.spawn(sourceActor, updates, 600, workflow.item, 60, workflow.token, "shadow");
    await mba.clearGMDialogMessage();
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .zIndex(3)
        .belowTokens()

        .wait(400)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
        })

        .play()
}

export let drowMage = {
    'summonDemon': summonDemon
}