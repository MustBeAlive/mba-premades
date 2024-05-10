import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

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
    let tokenName = `${workflow.token.document.name} Dancing Light`;
    let sourceActors = await mba.selectDocuments('Choose color: (Max: 4)', [DLBlueTeal, DLBlueYellow, DLGreen, DLPink, DLPurpleGreen, DLRed, DLYellow]);
        if (!sourceActors) return;
        if (sourceActors.length > 4) {
            ui.notifications.info('Too much actors selected!');
            return;
        }
        let updates =  {
            'token': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition 
            }
        }
    let animation = 'celestial';
    await summons.spawn(sourceActors, updates, 60, workflow.item, undefined, undefined, 120, workflow.token, animation, {}, workflow.castData.castLevel);
}