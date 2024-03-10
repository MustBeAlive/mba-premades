export async function animalFriendship({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    if (!target) return;
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'beast') {
        ui.notifications.warn('Animal Friendship работает только на существ типа "beast"!');
        return;
    }
    let targetIntValue = target.actor.system.abilities.int.value;
    if (targetIntValue >= 4) {
        ui.notifications.warn('Animal Friendship работает только на существ с значением интеллекта ниже 4!');
        return;
    }
    let spellDC = chrisPremades.helpers.getSpellDC(workflow.item);
    const saveRollData =  {
        request: "save",
        targetUuid: target.actor.uuid,
        ability: "wis",
        options: {
            chatMessage: true,
            flavor: `DC${spellDC} vs Animal Friendship`,
        },
    };
    const saveRoll = await MidiQOL.socket().executeAsGM("rollAbility", saveRollData);

    if (saveRoll.total < spellDC)  {
        const effectData = {
            'name': "Animal Friendship",
            'icon': "assets/library/icons/sorted/spells/level1/Animal_Friendship.webp",
            'description': "The beast is convinced that you mean it no harm.",
            'duration': {
                'startTime': game.time.worldTime,
                'seconds': 86400
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Charmed",
                    'priority': 20
                }
            ]
        };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    }
}