export function spectralVision(skillId, options) {
    return skillId != 'prc' ? false : {'label': '<u>Spectral Vision:</u><br>Does this check rely on sight?<br>', 'type': 'advantage'};
}