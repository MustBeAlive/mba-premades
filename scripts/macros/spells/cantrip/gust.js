import {mba} from "../../../helperFunctions.js";

export async function gust({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ['Push Target', 'push'],
        ['Create Blast', 'blast'],
        ['Create Harmless Effect', 'effect']
    ];
    await mba.playerDialogMessage();
    let selection = await mba.dialog(workflow.item.name, choices, `<b>Choose one of the following effects:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "push") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifications.warn('No target selected!')
            return;
        }
        if (mba.getSize(target.actor) > 2) {
            ui.notifications.warn('Gust can only push medium or smaller creatures!');
            return;
        }
        let spellDC = mba.getSpellDC(workflow.item);
        let saveRoll = await mba.rollRequest(target, 'save', 'str');
        if (saveRoll.total >= spellDC) {
            new Sequence()

                .effect()
                .file("animated-spell-effects-cartoon.air.bolt.ray")
                .attachTo(workflow.token)
                .stretchTo(target)

                .play()

            return;
        }
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.air.bolt.ray")
            .attachTo(workflow.token)
            .stretchTo(target)

            .play()

        await warpgate.wait(200);
        await mba.pushToken(workflow.token, target, 5);
    };
    if (selection === "blast") {
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
                    'wallRestriction': 'light',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await mba.placeTemplate(templateData);
        if (!template) return;

        new Sequence()

            .effect()
            .file("jb2a.whirlwind.bluegrey")
            .atLocation(template)
            .scaleToObject(1)

            .play()

    };
    if (selection === "effect") {
        new Sequence()

            .effect()
            .file("jb2a.whirlwind.bluegrey")
            .atLocation(workflow.token)
            .scaleToObject(1)

            .play()
    };
}