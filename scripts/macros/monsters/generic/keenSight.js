export function keenSight(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Sight:</u><br>Does this check rely on sight? (ask GM)', 'type': 'advantage'};
}