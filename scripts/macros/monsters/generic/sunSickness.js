import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.checkLight(workflow.token) != "bright") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'sunSickness', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS:Sun Sickness");
    queue.remove(workflow.item.uuid);
}

function save(saveId, options) {
    return {'label': '<u>Sun Sickness:</u><br>Are you in sunlight?<br>(ask GM)', 'type': 'disadvantage'};  
}

function skill(skillId, options) {
    return {'label': '<u>Sun Sickness:</u><br>Are you in sunlight?<br>(ask GM)', 'type': 'disadvantage'};
}

export let sunSickness = {
    'attack': attack,
    'save': save,
    'skill': skill
}