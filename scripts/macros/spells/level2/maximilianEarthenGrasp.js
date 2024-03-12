// Based on multiple CPR Summon Macro
export async function maximilianEarthenGrasp({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - MEG');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - MEG)');
        return;
    }
    let name = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Maximilian\'s Earthen Grasp';
    if (name === '') name = 'Maximilian\'s Earthen Grasp';
    let crushData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Summon Features', 'MEG Crush', false);
    if (!crushData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (MEG Crush)');
        return;
    }
    crushData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    let updates = {
        'actor': {
            'prototypeToken': {
                'name': name,
                'disposition': workflow.token.document.disposition
            },
        },
        'token': {
            'name': name,
            'disposition': workflow.token.document.disposition
        },
        'embedded': {
            'Item': {
                [crushData.name]: crushData,
            }
        }
    };
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'earth';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 30, workflow.token, animation);
}