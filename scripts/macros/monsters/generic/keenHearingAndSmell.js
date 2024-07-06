export function keenHearingAndSmell(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Hearing and Smell:</u><br>Does this check rely on hearing or smell?<br>(ask GM)', 'type': 'advantage'};
}