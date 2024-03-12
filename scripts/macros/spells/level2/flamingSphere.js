export async function flamingSphere({speaker, actor, token, character, item, args, scope, workflow}) {
    let folder = chrisPremades.helpers.getConfiguration(workflow.item, 'folder') ?? 'Flaming Sphere';
    if (folder === '') folder = 'Flaming Sphere';
    let actors = game.actors.filter(i => i.folder?.name === folder);
    if (actors.length < 1) {
        ui.notifications.warn('Missing actors in the side panel! (Folder name: "Flaming Shere"');
        return;
    }
    let sourceActor = await chrisPremades.helpers.selectDocument('Choose sphere color:', actors);
    if (!sourceActor) return;
    let name = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Flaming Sphere';
    if (name === '') name = 'Flaming Sphere';
    let ramData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Summon Features', 'Flaming Sphere Ram', false);
    if (!ramData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (Flaming Sphere Ram)');
        return;
    }
    ramData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    ramData.system.damage.parts[0][0] = workflow.castData.castLevel + 'd6[fire]';
    let auraData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Summon Features', 'Flaming Sphere Aura', false);
    if (!auraData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (Flaming Sphere Aura)');
        return;
    }
    auraData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    let updates = {
        'actor': {
            'system': {
                'attributes': {
                    'ac': {
                        'flat': workflow.castData.castLevel
                    }
                }
            },
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
                [ramData.name]: ramData,
                [auraData.name]: auraData,
            }
        }
    };
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'fire';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.summons.spawn(sourceActor, updates, 60, workflow.item, undefined, undefined, 30, workflow.token, animation);
}