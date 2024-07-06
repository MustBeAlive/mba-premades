import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.checkLight(workflow.token) != "bright") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'sunlightSensitivity', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS:Sunlight Sensitivity");
    queue.remove(workflow.item.uuid);
}

function skill(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Sunlight Sensitivity:</u><br>Does this check rely on sight while in bright light?<br>(ask GM)', 'type': 'disadvantage'};
}

export let sunlightSensitivity = {
    'attack': attack,
    'skill': skill
}