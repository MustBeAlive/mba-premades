import {mba} from "../../../helperFunctions.js";

export async function kenkuRecall({ speaker, actor, token, character, item, args, scope, workflow }) {
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => workflow.actor.system.skills[key].value === 1).map(([i, j]) => ({ 'value': i, 'html': j.label }));
    let choices = [];
    for (let i = 0; i < options.length; i++) choices.push([options[i].html, options[i].value]);
    if (!choices.length) {
        ui.notifications.warn("Unable to find any proficient skill!");
        return;
    }
    let selection = await mba.dialog("Kenku Recall", choices, "Choose one of the skills:");
    if (!selection) return;
    console.log(selection);
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have advantage on the next skill check of your choosing.",
        'changes': [
            {
                'key': `flags.midi-qol.advantage.skill.${selection}`,
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isSkill']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}