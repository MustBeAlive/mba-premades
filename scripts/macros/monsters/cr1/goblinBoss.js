import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: target substitution

async function redirectAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let goblins = Array.from(mba.findNearby(workflow.token, 5, "ally", false, false).filter(i => i.document.name.includes("Goblin")));
    if (!goblins.length) {
        ui.notifications.warn("No goblins around, unable to redirect attack!");
        return;
    }
    let target;
    if (goblins.length === 1) target = goblins[0].document;
    if (!target) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, goblins, true, 'one', undefined, false, 'Choose goblin to swap with:');
        let [newTarget] = selection.inputs.filter(i => i).slice(0);
        target = await fromUuid(newTarget);
    }
    if (!target) {
        ui.notifications.warn("Unable to select target!");
        return;
    }

    new Sequence()

        .animation()
        .on(workflow.token)
        .moveTowards(target.object)
        .snapToGrid()
        
        .animation()
        .on(target.object)
        .moveTowards(workflow.token)
        .snapToGrid()     

        .play()
}

export let goblinBoss = {
    'redirectAttack': redirectAttack
}