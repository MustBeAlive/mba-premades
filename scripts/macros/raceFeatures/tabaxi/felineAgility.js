import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let originFeature = await mba.getItem(workflow.actor, "Feline Agility");
    if (!originFeature) return;
    let prevTurnDistance = originFeature.flags['mba-premades']?.feature?.felineAgility?.distance;
    if (prevTurnDistance > 0) {
        ui.notifications.warn("You've moved on your previous turn!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let effectData = {
        'name': "Feline Agility",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your speed is doubled until the end of your turn.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': `system.attributes.movement.all`,
                'mode': 0,
                'value': "*2",
                'priority': 20
            }
        ]
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function turnEnd(origin, token) {
    console.log(origin);
    if (!game.modules.get("drag-ruler")?.active) return;
    let distance = await dragRuler.getMovedDistanceFromToken(token);
    console.log(distance);
    await origin.setFlag('mba-premades', 'feature.felineAgility.distance', distance);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feature.felineAgility.distance', '');
}

export let felineAgility = {
    'item': item,
    'turnEnd': turnEnd,
    'combatEnd': combatEnd
}