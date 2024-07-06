export function underwaterCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Underwater Camouflage:</u><br>Does this check involve hiding underwater?<br>(ask GM)', 'type': 'advantage'};
}