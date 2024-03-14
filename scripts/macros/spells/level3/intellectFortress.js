export async function intellectFortress({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel - 2;
    let concEffect = await chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    if (workflow.targets.size > ammount) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            await chrisPremades.helpers.removeEffect(concEffect);
            return;
        }
        let newTargets = selection.inputs.filter(i=>i).slice(0, ammount);
        await chrisPremades.helpers.updateTargets(newTargets);
    }
    let targets = Array.from(game.user.targets);
    const distanceArray = [];
    for (let i = 0; i < targets.length; i++) {
        for (let k = i + 1; k < targets.length; k++) {
            let target1 = fromUuidSync(targets[i].document.uuid).object;
            let target2 = fromUuidSync(targets[k].document.uuid).object;
            distanceArray.push(chrisPremades.helpers.getDistance(target1, target2));
        }
    }
    const found = distanceArray.some((distance)=>distance > 30);
    if (found === true) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other!')
        await chrisPremades.helpers.removeEffect(concEffect);
        return;
    }
    await warpgate.wait(100);
    for (let i=0; i < targets.length; i++) {
        let target = (targets[i]);
        const effectData = {
            'name': 'Intellect Fortress',
            'icon': 'icons/magic/control/control-influence-rally-purple.webp',
            'origin': workflow.item.uuid,
            'description': 'You have advantage on Intelligence, Wisdom, and Charisma saving throws, as well as resistance to psychic damage.',
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'system.traits.dr.value',
                    'mode': 0,
                    'value': "psychic",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.advantage.ability.save.int',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },        {
                    'key': 'flags.midi-qol.advantage.ability.save.wis',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.advantage.ability.save.cha',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.adv-reminder.message.ability.save.int',
                    'mode': 2,
                    'value': "You have advantage on Intelligence, Wisdom, and Charisma saving throws.",
                    'priority': 20
                },
                {
                    'key': 'flags.adv-reminder.message.ability.save.wis',
                    'mode': 2,
                    'value': "You have advantage on Intelligence, Wisdom, and Charisma saving throws.",
                    'priority': 20
                },
                {
                    'key': 'flags.adv-reminder.message.ability.save.cha',
                    'mode': 2,
                    'value': "You have advantage on Intelligence, Wisdom, and Charisma saving throws.",
                    'priority': 20
                }
            ]
        };
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    }
}