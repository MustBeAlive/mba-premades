export function brave(saveId, options) {
    return saveId != 'wis' ? false : {'label': '<u>Brave:</u><br>Are you saving against being Frightened?<br>(ask GM)', 'type': 'advantage'};  
}