export function keenSightAndSmell(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Sight and Smell:</u><br>Does this check rely on sight or smell? (ask GM)', 'type': 'advantage'};
}