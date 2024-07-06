export function labyrinthineRecall(skillId, options) {
    return skillId != 'sur' ? false : {'label': '<u>Labyrinthine Recall:</u><br>Are you attempting to navigate or track?<br>(ask GM)', 'type': 'advantage'};
}