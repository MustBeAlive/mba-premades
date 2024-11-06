import {mba} from "../../helperFunctions.js";

export async function standUp({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Prone");
    if (!effect) {
        ui.notifications.info("You are not prone!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let effectData = {
        'name': "Movement Penalty",
        'icon': workflow.item.img,
        'description': `
            <p>You've spent half of your movement to stand up from being @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0.5",
                'priority': 20
            },
        ],
    };
    if (mba.getItem(workflow.actor, "Athlete")) effectData = {
        'name': "Movement Penalty: Athlete",
        'icon': workflow.item.img,
        'description': `
            <p>You've spent 5 feet of your movement to stand up from being @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 2,
                'value': "-5",
                'priority': 20
            },
        ],
    };
    await mba.removeEffect(effect);
    await mba.createEffect(workflow.actor, effectData);
}