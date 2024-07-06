export function mentalFortitude(saveId, options) {
    return saveId != 'wis' ? false : {'label': '<u>Mental Fortitude:</u><br>Are you saving against being Charmed or Frightened?<br>(ask GM)', 'type': 'advantage'};  
}