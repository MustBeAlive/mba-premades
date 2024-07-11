import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function viciousReprisal({ speaker, actor, token, character, item, args, scope, workflow }) {
    let validTargets = await mba.findNearby(workflow.token, 5, "any", false, false);
    if (!validTargets.length) {
        await mba.gmDialogMessage();
        await mba.dialog("Vicious Reprisal", [["Ok!", false]], `
                <p>No valid targets within 5 feet of Abishai</p>
                <p>Instead, the abishai moves up to half its speed toward an enemy it can see, without provoking opportunity attacks.</p>
                <p>Half Speed: 15 walk or 20 fly</p>
            `);
        await mba.clearGMDialogMessage();
    }
    else if (validTargets.length) {
        console.log(validTargets);
        let target;
        if (validTargets.length === 1) target = validTargets[0];
        else {
            let randomRoll = await new Roll(`1d${validTargets.length}`).roll({ 'async': true });
            console.log(randomRoll.total);
            target = validTargets[`${randomRoll.total - 1}`];
        }
        let feature = await mba.getItem(workflow.actor, "Bite");
        if (!feature) return;
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
}

export let abishaiWhite = {
    'viciousReprisal': viciousReprisal
}