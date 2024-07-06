import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnStart() {
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'radiantSoul': {
                            'used': 0
                        }
                    }
                }
            }
        };
        let effect = await mbaPremades.helpers.findEffect(actor, "Radiant Soul");
        if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
    }
    let effectData = {
        'name': "Radiant Soul",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Two luminous, spectral wings sprout from your back temporarily for the duration.</p>
            <p>You gain a flying speed equal to your walking speed, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell.</p>
            <p>The extra damage equals your proficiency bonus.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.fly',
                'mode': 4,
                'value': "@attributes.movement.walk",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.radiantSoul.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'feature': {
                    'radiantSoul': {
                        'used': 0
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let effect = await mba.findEffect(workflow.actor, "Radiant Soul");
    if (!effect) return;
    if (effect.flags['mba-premades']?.feature?.radiantSoul?.used === 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "radiantSoul", 249);
    if (!queueSetup) return;
    let selection = await mba.dialog("Radiant Soul", constants.yesNo, `Deal extra damage? (+${workflow.actor.system.attributes.prof}[radiant])`);
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `+${workflow.actor.system.attributes.prof}[radiant]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'radiantSoul': {
                        'used': 1
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

export let radiantSoul = {
    'item': item,
    'damage': damage
}