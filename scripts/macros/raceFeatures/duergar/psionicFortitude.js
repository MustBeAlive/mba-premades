export function psionicFortitude(saveId, options) {
    if (saveId === 'con') return {'label': '<u>Psionic Fortitude:</u><br>Are you saving against being Stunned?<br>(ask GM)', 'type': 'advantage'};
    else if (saveId === 'wis') return {'label': '<u>Psionic Fortitude:</u><br>Are you saving against being Charmed?<br>(ask GM)', 'type': 'advantage'};
    else return false;
}