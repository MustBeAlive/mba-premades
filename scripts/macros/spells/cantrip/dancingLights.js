export async function dancingLights({speaker, actor, token, character, item, args, scope, workflow}) {
    let DLBlueTeal = game.actors.getName('DL - BlueTeal');
    let DLBlueYellow = game.actors.getName('DL - BlueYellow');
    let DLGreen = game.actors.getName('DL - Green');
    let DLPink = game.actors.getName('DL - Pink');
    let DLPurpleGreen = game.actors.getName('DL - PurpleGreen');
    let DLRed = game.actors.getName('DL - Red');
    let DLYellow = game.actors.getName('DL - Yellow');
    if (!DLBlueTeal || !DLBlueYellow || !DLGreen || !DLPink || !DLPurpleGreen || !DLRed || !DLYellow ) {
        ui.notifications.warn('Missing actors in the side panel!');
        return;
    }
    let totalSummons = 4;
    let sourceActors = await chrisPremades.helpers.selectDocuments('Choose color: (Max ' + totalSummons + ')', [DLBlueTeal, DLBlueYellow, DLGreen, DLPink, DLPurpleGreen, DLRed, DLYellow]);
        if (!sourceActors) return;
        if (sourceActors.length > totalSummons) {
            ui.notifications.info('Too much actors selected!');
            return;
        }
        let updates =  {
            'token': {
                'disposition': workflow.token.document.disposition 
            }
        }
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'celestial';
    if (chrisPremades.helpers.jb2aCheck() != 'patreon' || !chrisPremades.helpers.aseCheck()) animation = 'none';
    await chrisPremades.summons.spawn(sourceActors, updates, 60, workflow.item, undefined, undefined, 120, workflow.token, animation);
}