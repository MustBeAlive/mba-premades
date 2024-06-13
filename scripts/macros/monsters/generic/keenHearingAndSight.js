export function keenHearingAndSight(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Hearing and Sight:</u><br>Does this check rely on hearing or sight? (ask GM)', 'type': 'advantage'};
}