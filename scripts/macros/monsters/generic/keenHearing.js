export function keenHearing(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Hearing:</u><br>Does this check rely on hearing?<br>(ask GM)', 'type': 'advantage'};
}