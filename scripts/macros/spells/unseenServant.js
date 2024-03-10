export async function unseenServant({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - Unseen Servant');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Unseen Servant)');
        return;
    }
    let name = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Unseen Servant';
    if (name === '') name = 'Unseen Servant';
    let updates = {
        'token': {
            'disposition': workflow.token.document.disposition
        }
    };
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'celestial';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 60, workflow.token, animation);
}