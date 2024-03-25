export async function acidSplash({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.targets.size != 2) return;
        let tokens = Array.from(workflow.targets);
        let distance = chrisPremades.helpers.getDistance(tokens[0], tokens[1]);
        if (distance > 5) {
            ui.notifications.warn('Targets are not within 5 ft. of each other!');
            return false;
        }
}