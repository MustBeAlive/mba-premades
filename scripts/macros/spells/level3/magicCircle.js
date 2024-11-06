import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: everything >.<

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Celestial", "celestial", "modules/mba-premades/icons/spells/level3/magic_circle_celestial.webp"],
        ["Elemental", "elemental", "modules/mba-premades/icons/spells/level3/magic_circle_elemental.webp"],
        ["Fey", "fey", "modules/mba-premades/icons/spells/level3/magic_circle_fey.webp"],
        ["Fiend", "fiend", "modules/mba-premades/icons/spells/level3/magic_circle_fiend.webp"],
        ["Undead", "undead", "modules/mba-premades/icons/spells/level3/magic_circle_undead.webp"],
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Magic Circle", choices, "<b>Select creature type:</b>", "both");
    await mba.clearPlayerDialogMessage();
    if (!selection.length) return;
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'spell': {
                    'magicCircle': true
                },
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'creatureType': selection[0],
                    'icon': selection[1],
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    let duration = (workflow.castData.castLevel - 2) * 3600
    let effectData = {
        'name': "Magic Circle",
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': duration
        },
        'flags': {
            'mba-premades': {
                'spell': {
                    'magicCircle': {
                        'creatureType': selection[0]
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function hook(workflow) {

}

export let magicCircle = {
    'item': item,
    'hook': hook
}