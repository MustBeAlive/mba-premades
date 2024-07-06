export function keenSmell(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Smell:</u><br>Does this check rely on smell?<br>(ask GM)', 'type': 'advantage'};
}