export function brave(saveId, options) {
    return saveId != 'wis' ? false : {'label': '<u>Brave:</u><br>Are you saving against being Frightened? (ask GM)', 'type': 'advantage'};  
}