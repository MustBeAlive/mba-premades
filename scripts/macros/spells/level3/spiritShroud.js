import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

//To do: descriptions, animations

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Cold", "cold", "modules/mba-premades/icons/generic/generic_cold.webp"],
        ["Necrotic", "necrotic", "modules/mba-premades/icons/generic/generic_necrotic.webp"],
        ["Radiant", "radiant", "modules/mba-premades/icons/generic/generic_radiant.webp"]
    ];
    let selection = await mba.selectImage("Spirit Shroud", choices, "<b><Choose damage type:/b>", "value");
    if (!selection) return;
    async function effectMacroEveryTurn() {
        await mbaPremades.macros.spiritShroud.slow(token, origin);
    };
    let effectData = {
        'name': "Spirit Shroud",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.spiritShroud.attack,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                }
            },
            'mba-premades': {
                'spell': {
                    'spiritShroud': {
                        'damageType': selection
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let distance = MidiQOL.getDistance(workflow.token, workflow.targets.first(), { wallsBlock: false });
    if (distance > 10) return;
    let effect = mba.findEffect(workflow.actor, "Spirit Shroud");
    if (!effect) return;
    let castLevel = effect.flags['midi-qol'].castData.castLevel;
    let damageType = effect.flags['mba-premades']?.spell?.spiritShroud?.damageType;
    if (!damageType) damageType = 'necrotic';
    let diceNum;
    switch (castLevel) {
        case 3:
        case 4:
            diceNum = 1;
            break;
        case 5:
        case 6:
            diceNum = 2;
            break;
        case 7:
        case 8:
            diceNum = 3;
            break;
        case 9:
            diceNum = 4;
            break;
    };
    let queueSetup = await queue.setup(workflow.item.uuid, 'spiritShroud', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `${diceNum}d8[${damageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

async function slow(token, origin) {
    let target = game.canvas.tokens.get(game.combat.current.tokenId);
    if (!target) return;
    if (target.document.disposition === token.document.disposition) return;
    if (mba.getDistance(token, target) > 10) return;
    let effect = mba.findEffect(target.actor, "Spirit Shroud: Slow");
    if (effect) await mba.removeEffect(effect);
    let effectData = {
        'name': 'Spirit Shroud: Slow',
        'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
        'origin': origin.actor.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'rounds': 1
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': '-10',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'macroRepeat': 'none',
                'specialDuration': ['turnStartSource', 'combatEnd'],
                'stackable': 'multi',
                'transfer': false,
            }
        }
    }
    await mba.createEffect(target.actor, effectData);
}

export let spiritShroud = {
    'item': item,
    'attack': attack,
    'slow': slow
}