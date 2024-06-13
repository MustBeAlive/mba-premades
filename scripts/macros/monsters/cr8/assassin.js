import {mba} from "../../../helperFunctions.js";

async function assassinate({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (game.combat.round != 1) return;
    let target = workflow.targets.first();
    let [targetCombatant] = game.combat.combatants.filter(i => i.tokenId === target.document.id);
    if (!targetCombatant) return;
    if (game.combat.combatant.initiative < targetCombatant.initiative) {
        let effect = await mba.findEffect(workflow.actor, "Assassinate: Advantage");
        if (effect) await mba.removeEffect(effect);
        return
    }
    const effectData = {
        'name': "Assassinate: Advantage",
        'icon': "icons/skills/melee/strike-sword-blood-red.webp",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['1Attack']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function surprise({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.targets.first().actor, "Surprised")) return;
    const effectData = {
        'name': "Assassinate: Critical",
        'icon': "icons/skills/melee/strike-sword-blood-red.webp",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.critical.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['DamageDealt']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

export let assassin = {
    'assassinate': assassinate,
    'surprise': surprise
}