import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function barbedHide(token) {
    let feature = await mba.getItem(token.actor, "Barbed Hide");
    if (!feature) return;
    let effect = await mba.findEffect(token.actor, "Grappled");
    if (!effect) return;
    let grappleOrigin = await fromUuid(effect.origin);
    let targetDoc;
    if (grappleOrigin instanceof TokenDocument) targetDoc = grappleOrigin;
    if (grappleOrigin instanceof Item) targetDoc = grappleOrigin.parent.parent;
    let [config, options] = constants.syntheticItemWorkflowOptions([targetDoc.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

export let barbedDevil = {
    'barbedHide': barbedHide
}