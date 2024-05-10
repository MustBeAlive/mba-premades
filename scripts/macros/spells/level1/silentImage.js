import {mba} from "../../../helperFunctions.js";

export async function silentImage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["5 ft.", 7], ["10 ft.", 14.1], ["15 ft.", 21.2]];
    let size = await mba.dialog("Choose object size:", choices);
    if (!size) return;

    let templateData = {
        't': "rect",
        'user': game.user,
        'distance': size,
        'direction': 45,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'midi-qol': {
                'originUuid': workflow.item.uuid
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'move',
                'wallsBlock': 'recurse',
            }
        }
    };
    let template = await mba.placeTemplate(templateData);
    if (!template) return;
    let templateEffectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.dae.deleteUuid',
                'mode': 5,
                'priority': 20,
                'value': template.uuid
            }
        ],
    };
    await mba.createEffect(workflow.actor, templateEffectData);

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.complete.dark_pink")
        .attachTo(template)
        .scaleToObject(1)
        .persist()
        .name(`Silent Image`)

        .play()
}