import {mba} from "../../../../helperFunctions.js";

export async function tirelessSpirit(actor) {
    let feature = await mba.getItem(actor, "Fighting Spirit");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Fighting Spirit!");
        return;
    }
    if (feature.system.uses.value > 0) return;
    await feature.update({ "system.uses.value": 1 });
}