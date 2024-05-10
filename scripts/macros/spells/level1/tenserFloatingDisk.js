import {tashaSummon} from "../../generic/tashaSummon.js";

export async function tenserFloatingDisk({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - Floating Disk');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Floating Disk)');
        return;
    }
    let tokenName = `${workflow.token.document.name} Floating Disk`;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition
            }
        },
        'token': {
            'name': tokenName,
            'disposition': workflow.token.document.disposition
        }
    };
    let animation = 'future';
    await tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 30, workflow.token, animation, {}, workflow.castData.castLevel);
}