import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function intellectFortress({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 2;
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            await mba.removeCondition(workflow.actor, "Concentrating");
            return;
        }
        let check = selection.inputs.filter(i => i != false);
        if (check.length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            await mba.removeCondition(workflow.actor, "Concentrating");
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
    }
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    if (mba.within30(targets) === false) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other, try again!')
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': 'You have advantage on Intelligence, Wisdom, and Charisma saving throws, as well as resistance to psychic damage for the duration.',
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
            }, {
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
        ],
        'midi-qol': {
            'castData': {
                baseLevel: 3,
                castLevel: workflow.castData.castLevel,
                itemUuid: workflow.item.uuid
            }
        }
    };
    for (let target of targets) await mba.createEffect(target.actor, effectData);
}