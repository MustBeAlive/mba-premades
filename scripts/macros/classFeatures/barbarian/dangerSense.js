import {mba} from "../../../helperFunctions.js";

export function dangerSense(saveId, options) {
    let blinded = mba.findEffect(this, 'Blinded');
    let deafened = mba.findEffect(this, 'Deafened');
    let incapacitated = mba.findEffect(this, 'Incapacitated');
    if (blinded || deafened || incapacitated) return;
    return saveId != 'dex' ? false : {'label': '<u>Danger Sense:</u><br>Are you saving against an effect you can see? (ask GM)', 'type': 'advantage'};
}