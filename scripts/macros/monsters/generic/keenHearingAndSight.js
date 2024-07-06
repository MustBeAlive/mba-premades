export function keenHearingAndSight(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Hearing and Sight:</u><br>Does this check rely on hearing or sight?<br>(ask GM)', 'type': 'advantage'};
}