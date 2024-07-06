export function slippery(skillId, options) {
    if (skillId === 'acr') return {'label': '<u>Slippery:</u><br>Are you attempting to escape Grapple?<br>(ask GM)', 'type': 'advantage'};
    else if (skillId === 'ath') return {'label': '<u>Slippery:</u><br>Are you attempting to escape Grapple?<br>(ask GM)', 'type': 'advantage'};
    else return false;
}