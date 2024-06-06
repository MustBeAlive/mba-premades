import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function unarmedStrikeMonk({ speaker, actor, token, character, item, args, scope, workflow }) {
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let subClassIdentifier = workflow.actor.classes.monk?.subclass?.identifier;
}