export function darkDevotion(saveId, options) {
    return saveId != 'wis' ? false : {'label': '<u>Dark Devotion:</u><br>Are you saving against being Charmed or Frightened? (ask GM)', 'type': 'advantage'};  
}