import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function melt(token) {
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Melt", constants.yesNo, "<b>Is Snow Golem in the area of extreme heat?</b>");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let damageRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll);
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { alias: name },
        flavor: `${token.document.name}: Melt`
    });
    await mba.applyDamage([token], damageRoll.total, "none");
}

export let snowGolem = {
    'melt': melt
}