export async function crowbar({ speaker, actor, token, character, item, args, scope, workflow }) {
    let options = [["Leverage can be applied, proceed", "yes"], ["Leverage cannot be applied, cancel", "no"]];
    let selection = await chrisPremades.helpers.remoteDialog(workflow.item.name, options, game.users.activeGM.id, `<b>${workflow.token.document.name}</b> wants to use crowbar`);
    if (!selection || selection === "no") {
        ui.notifications.info("GM has denied your request. Sorry!");
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have advantage on the next Strength check you make.",
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.ability.check.str',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isCheck.str']
            }
        }
    }
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}