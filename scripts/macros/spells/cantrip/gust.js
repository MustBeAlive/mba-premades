export async function gust({speaker, actor, token, character, item, args, scope, workflow}) {
    let choices  = [
        ['Push Target', 'push'],
        ['Create Blast', 'blast'],
        ['Create Harmless Effect', 'effect']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose one of the following effects', choices);
    if (!selection) {
        return;
    }
    switch (selection) {
        case 'push': {
            let target = workflow.targets.first();
            if (!target) {
                ui.notifications.warn('No target selected!')
                return;
            }
            let size = chrisPremades.helpers.getSize(target.actor);
            if (size > 2) {
                ui.notifications.warn('Gust can only push medium or smaller creatures!');
                return;
            }
            let spellDC = chrisPremades.helpers.getSpellDC(workflow.item);
            const saveRollData =  {
                request: "save",
                targetUuid: target.actor.uuid,
                ability: "str",
                options: {
                    chatMessage: true,
                    flavor: `DC${spellDC} vs Gust: Push`,
                },
            };
            const saveRoll = await MidiQOL.socket().executeAsGM("rollAbility", saveRollData);
            if (saveRoll.total < spellDC)  {
                await chrisPremades.helpers.pushToken(workflow.token, target, 5);
                new Sequence()
                .effect()
                .file("jb2a.whirlwind.bluegrey")
                .atLocation(target)
                .scaleToObject(1)
                .play()
            }
            break;
        }
        case 'blast': {
            let templateData = {
                't': 'rect',
                'user': game.user,
                'distance': 7,
                'direction': 45,
                'width': 7,
                'fillColor': game.user.color,
                'flags': {
                    'dnd5e': {
                        'origin': workflow.item.uuid
                    },
                    'midi-qol': {
                        'originUuid': workflow.item.uuid
                    },
                    'walledtemplates': {
                        'wallRestriction': 'move',
                        'wallsBlock': 'recurse',
                    }
                },
                'angle': 0
            };
            let template = await chrisPremades.helpers.placeTemplate(templateData);
            if (!template) return;

            new Sequence()
            .effect()
            .file("jb2a.whirlwind.bluegrey")
            .atLocation(template)
            .scaleToObject(1)
            .play()

            break;
        }
        case 'effect': {
            new Sequence()
            .effect()
            .file("jb2a.whirlwind.bluegrey")
            .atLocation(token)
            .scaleToObject(1)
            .play()
        }
    }
}