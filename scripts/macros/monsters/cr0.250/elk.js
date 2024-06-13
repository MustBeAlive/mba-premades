import {mba} from "../../../helperFunctions.js";

async function hooves({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.targets.first().actor, "Prone")) {
        ui.notifications.warn("Target must be prone!");
        return false;
    }
}

export let elk = {
    'hooves': hooves
}