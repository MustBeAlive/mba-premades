import {mba} from "../../../helperFunctions.js";

export function dangerSense(saveId, options) {
    let blinded = mba.findEffect(this, 'Blinded');
    let deafened = mba.findEffect(this, 'Deafened');
    let incapacitated = mba.findEffect(this, 'Incapacitated');
    if (blinded || deafened || incapacitated) return;
    return saveId != 'dex' ? false : {'label': '<h3>Check the box if this save is from an effect you can see.</h3>', 'type': 'advantage'};
}