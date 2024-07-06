import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function summonDemon({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Summon Quasit", "quasit"], ["Attempt to Summon Shadow Demon (1d100)", "shadow"]];
    let selection = await mba.dialog("Summon Demon", choices, "<b>What would you like to do?</b>");
    if (!selection) return;
    let sourceActor;
    let tokenName
    if (selection === "quasit") {
        sourceActor = game.actors.getName("FF: Quasit");
        if (!sourceActor) {
            ui.notifications.warn("Unale to find actor! (FF: Quasit)");
            return;
        }
        tokenName = "Quasit";
    }
    else if (selection === "shadow") {
        let shadowRoll = await new Roll("1d100").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(shadowRoll);
        if (shadowRoll.total < 51) {
            ui.notifications.info("Attempt fails!");
            return;
        }
        sourceActor = game.actors.getName("Shadow Demon");
        if (!sourceActor) {
            ui.notifications.warn("Unale to find actor! (Shadow Demon)");
            return;
        }
        tokenName = "Shadow Demon";
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
    await tashaSummon.spawn(sourceActor, updates, 600, workflow.item, 60, workflow.token, "shadow");
}

export let drowMage = {
    'summonDemon': summonDemon
}