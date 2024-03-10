export async function tenserFloatingDisk({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - Floating Disk');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Floating Disk)');
        return;
    }
    let name = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Floating Disk';
    if (name === '') name = 'Floating Disk';
    let updates = {
        'token': {
            'disposition': workflow.token.document.disposition
        }
    };
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'future';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 30, workflow.token, animation);
}