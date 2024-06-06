import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function strokeOfLuck({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.attackTotal >= workflow.targets.first().actor.system.attributes.ac.value) return;
    let strokeOfLuckItem = await mba.getItem(workflow.actor, "Stroke of Luck");
    if (!strokeOfLuckItem) return;
    if (strokeOfLuckItem.system.uses.value < 1) return;
    let selection = await mba.dialog("Stroke of Luck", constants.yesNo, "<p>You've missed your attack.</p><p>Would you like to use <b>Stroke of Luck</b> to succeed instead?</p>")
    if (!selection) return;
    let reroll = await new Roll(`100`).roll({ async: true });
    await workflow.setAttackRoll(reroll);
    await strokeOfLuckItem.update({ "system.uses.value": 0 })
}