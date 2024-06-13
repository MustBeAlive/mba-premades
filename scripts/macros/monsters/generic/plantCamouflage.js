export function plantCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Plant Camouflage:</u><br>Does this check involve hiding in any terrain with ample obscuring vegetation? (ask GM)', 'type': 'advantage'};
}