import {tashaSummon} from "../../generic/tashaSummon.js";

export async function unseenServant({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.getName('MBA - Unseen Servant');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Unseen Servant)');
        return;
    }
    let tokenName = `${workflow.token.document.name} Unseen Servant`;
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
    let animation = 'celestial';
    await tashaSummon.spawn(sourceActor, updates, 3600, workflow.item, 60, workflow.token, animation, {}, workflow.castData.castLevel);
}