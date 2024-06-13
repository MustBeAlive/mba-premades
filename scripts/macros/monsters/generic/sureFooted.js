export function sureFooted(saveId, options) {
    return saveId != 'str' ? false : {'label': '<u>Sure-Footed:</u><br>Are you saving against being knocked Prone? (ask GM)', 'type': 'advantage'}; 
}