import {mba} from "../../../helperFunctions.js";

export async function perfectSelf(actor) {
    let kiItem = await mba.getItem(actor, "Ki Points");
    if (!kiItem) return;
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints > 0) return;
    await kiItem.update({ "system.uses.value": 4 });
}