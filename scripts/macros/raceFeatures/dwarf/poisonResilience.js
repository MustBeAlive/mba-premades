export function poisonResilience(saveId, options) {
    return saveId != 'con' ? false : {'label': '<u>Poison Resilience:</u><br>Are you saving against being Poisoned?<br>(ask GM)', 'type': 'advantage'};  
}