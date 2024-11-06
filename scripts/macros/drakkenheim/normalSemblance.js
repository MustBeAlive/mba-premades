export function normalSemblance(skillId, options) {
    return skillId != 'dec' ? false : {'label': '<u>Normal Semblance:</u><br>Is this check made in attempt to pass off as a normal humanoid creature?<br>(ask GM)', 'type': 'advantage'};
}