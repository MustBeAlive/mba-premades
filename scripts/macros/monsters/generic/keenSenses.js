export function keenSenses(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Keen Senses:</u><br>Does this check rely on sight, hearing, or smell?<br>(ask GM)', 'type': 'advantage'};
}