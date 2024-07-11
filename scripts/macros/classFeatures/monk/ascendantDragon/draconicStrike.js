import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

export async function draconicStrike({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let unarmedStrike = mba.getItem(workflow.actor, 'Unarmed Strike (Monk)');
    if (!unarmedStrike) return;
    if (workflow.item.uuid != unarmedStrike.uuid) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'draconicStrike', 50);
    if (!queueSetup) return;
    let choices = [
        ["Acid 🧪", "acid"],
        ["Cold ❄️", "cold"],
        ["Fire 🔥", "fire"],
        ["Lightning ⚡", "lightning"],
        ["Poison ☠️", "poison"],
        ["Unchanged (Bludgeoning)", "bludgeoning"],
    ];
    await mba.playerDialogMessage();
    let damageType = await mba.dialog("Draconic Strike", choices, "<b>Choose damage type:</b>");
    await mba.clearPlayerDialogMessage();
    if (!damageType) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageRoll = workflow.damageRoll
    damageRoll.terms[0].options.flavor = damageType;
    damageRoll.terms[2].options.flavor = damageType;
    damageRoll._formula = damageRoll._formula.replace(workflow.defaultDamageType, damageType);
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}