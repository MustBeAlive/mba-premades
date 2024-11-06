import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

async function bonus({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.system?.actionType != "rwak" || workflow.item.system?.prof?.hasProficiency === false) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'sharpshooter', 150);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Sharpshooter", constants.yesNo, "<b>Use Shapshooter?</b><br>(<b>-5</b> to Attack roll, <b>+10</b> to Damage roll)");
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    const effectData = {
        'name': "Sharpshooter: Bonus",
        'icon': "modules/mba-premades/icons/generic/sharpshooter.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>Your next ranged weapon attack has -5 penalty to the attack roll.</p>
            <p>If the attack hits, you add +10 to the attack's damage.</p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.rwak.attack',
                'mode': 2,
                'value': "-5",
                'priority': 30
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': `+ 10[${workflow.item.system?.damage?.parts[0][1]}]`,
                'priority': 30
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Attack:rwak', 'turnEnd', 'combatEnd']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    queue.remove(workflow.item.uuid);
}

//Cringe, but settle with this for now
async function cover({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.system?.actionType != "rwak") return;
    let target = workflow.targets.first();
    if (!target) return;
    let bonus;
    let half = await mba.findEffect(target.actor, "Cover (Half)");
    let three = await mba.findEffect(target.actor, "Cover (Three-Quarters)");
    if (!half && !three) return;
    if (half) bonus = "+2";
    else if (three) bonus = "+5";
    const effectData = {
        'name': "Sharpshooter: Ignore Cover",
        'icon': "modules/mba-premades/icons/generic/sharpshooter_cover.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>Your ranged weapon attacks ignore half cover and three-quarters cover.</p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.rwak.attack',
                'mode': 2,
                'value': bonus,
                'priority': 25
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Attack:rwak', 'turnEnd', 'combatEnd']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

export let sharpshooter = {
    'bonus': bonus,
    'cover': cover
}