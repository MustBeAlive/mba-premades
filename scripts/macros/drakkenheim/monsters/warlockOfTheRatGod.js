import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

async function conjureAnimals({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("Giant Rat");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (Giant Rat)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Giant Rat`;
    let sourceActors = [];
    let choices = [["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8]];
    let ammount = await mba.dialog("Conjure Animals", choices, `<b>Select ammount of Giant Rats to summon:</b>`);
    if (!ammount) return;
    for (let i = 0; i < ammount; i++) sourceActors.push(sourceActor);
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
                'system': {
                    'details': {
                        'type': {
                            'value': "fey"
                        }
                    }
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName
        }
    }
    await mba.playerDialogMessage(game.user);
    await summons.spawn(sourceActors, updates, 3600, workflow.item, undefined, undefined, 60, workflow.token, "nature", {}, workflow.castData.castLevel);
    await mba.clearPlayerDialogMessage();
}

export let warlockOfTheRatGod = {
    'conjureAnimals': conjureAnimals
}