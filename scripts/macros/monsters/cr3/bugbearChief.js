function heartOfHruggek(saveId, options) {
    return {'label': '<u>Heart of Hruggek:</u><br>Are you saving against being charmed, frightened, paralyzed, poisoned, stunned, or put to sleep?<br>(ask GM)', 'type': 'advantage'};  
}

export let bugbearChief = {
    'heartOfHruggek': heartOfHruggek
}