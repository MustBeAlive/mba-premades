export function swampCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Swamp Camouflage:</u><br>Does this check involve hiding in swamp?<br>(ask GM)', 'type': 'advantage'};
}