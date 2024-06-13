export function snowCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Snow Camouflage:</u><br>Does this check involve hiding in snowy terrain? (ask GM)', 'type': 'advantage'};
}