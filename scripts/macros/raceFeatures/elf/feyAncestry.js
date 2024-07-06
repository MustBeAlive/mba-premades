export function feyAncestry(saveId, options) {
    return saveId != 'wis' ? false : {'label': '<u>Fey Ancestry:</u><br>Are you saving against being Charmed?<br>(ask GM)', 'type': 'advantage'};  
}