import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function imixBlessing({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!workflow.hitTargets.size || !workflow.damageList) return;
    let doHealing = false;
    for (let i of workflow.damageList) {
        if (i.oldHP != 0 && i.newHP === 0) {
            doHealing = true;
            break;
        }
    }
    if (!doHealing) return;
    let feature = await mba.getItem(workflow.actor, "Imix's Blessing");
    if (!feature) return;
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

export let firenewtWarlockOfImix = {
    'imixBlessing': imixBlessing
}