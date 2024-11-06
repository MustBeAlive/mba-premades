import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

export async function daylight({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA: Daylight");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Daylight)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Daylight`;
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
    await mba.playerDialogMessage(game.user);
    await tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 60, workflow.token, "celestial", {}, workflow.castData.castLevel);
    await mba.clearPlayerDialogMessage();
}