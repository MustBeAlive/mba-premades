export async function mageHand({speaker, actor, token, character, item, args, scope, workflow}) {
    let folder = chrisPremades.helpers.getConfiguration(workflow.item, 'folder') ?? 'Mage Hand';
    if (folder === '') folder = 'Mage Hand';
    let actors = game.actors.filter(i => i.folder?.name === folder);
    if (actors.length < 1) {
        ui.notifications.warn('Missing actors in the side panel!');
        return;
    }
    let sourceActor = await chrisPremades.helpers.selectDocument('Choose hand color:', actors);
    if (!sourceActor) return;
    let updates =  {
        'token': {
            'disposition': workflow.token.document.disposition 
        }
    }
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'celestial';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.summons.spawn(sourceActor, updates, 60, workflow.item, undefined, undefined, 30, workflow.token, animation);
}