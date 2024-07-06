export function stoneCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Stone Camouflage:</u><br>Does this check involve hiding in rocky terrain?<br>(ask GM)', 'type': 'advantage'};
}