export async function spareTheDying({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    if (target.document.uuid === token.document.uuid) {
        ui.notifications.warn('Wrong target selected!');
        return;
    }
    if (target.actor.system.attributes.hp.value > 0) {
        ui.notifications.warn('Target is alive!');
        return;
    }
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Spare the Dying has no effect on undead or constructs!');
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': 'You are stable and no longer have to make death saving throws',
        'duration': {
            'startTime': game.time.worldTime,
            'seconds': 86400
        },
        'flags': {
            'dae': {
                'specialDuration': ['isHealed', 'shortRest', 'longRest'],
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 0,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        },
        'changes': [
            {
                'key': 'system.attributes.death.success',
                'mode': 5,
                'value': 3,
                'priority': 20
            }
        ]
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}