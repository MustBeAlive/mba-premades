import {mba} from "../../../helperFunctions.js";

async function tail({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.targets.first().actor, "Giant Crocodile: Grapple")) {
        ui.notifications.warn("Unable to attack grappled target!");
        return false;
    }
}

export let giantCrocodile = {
    'tail': tail
}