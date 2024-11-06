export function mistyCamouflage(skillId, options) {
    return skillId != 'ste' ? false : {'label': '<u>Misty Camouflage:</u><br>Does this check involve hiding in any area obscured by mist or fog?<br>(ask GM)', 'type': 'advantage'};
}