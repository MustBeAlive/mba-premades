import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Cold", "cold", "modules/mba-premades/icons/generic/generic_cold.webp"],
        ["Necrotic", "necrotic", "modules/mba-premades/icons/generic/generic_necrotic.webp"],
        ["Radiant", "radiant", "modules/mba-premades/icons/generic/generic_radiant.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Spirit Shroud", choices, "<b><Choose damage type:</b>", "value");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let diceNum;
    switch (workflow.castData.castLevel) {
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
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} SpiShr` })
    };
    async function effectMacroEveryTurn() {
        await mbaPremades.macros.spiritShroud.slow(token, origin);
    };
    let effectData = {
        'name': "Spirit Shroud",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, any attack you make deals extra ${diceNum}d8 ${selection} damage when you hit a creature within 10 feet of you.</p>
            <p>Any creature that takes this damage can't regain hit points until the start of your next turn.</p>
            <p>In addition, any creature of your choice that you can see that starts its turn within 10 feet of you has its speed reduced by 10 feet until the start of your next turn.</p>
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
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
    let animation1;
    let animation2;
    let hue1;
    switch (selection) {
        case "cold":
            animation1 = "jb2a.aura_themed.01.inward.complete.wood.01.purple";
            animation2 = "jb2a.aura_themed.01.inward.loop.wood.01.purple";
            hue1 = 290;
            break;
        case "necrotic":
            animation1 = "jb2a.aura_themed.01.inward.complete.wood.01.green";
            animation2 = "jb2a.aura_themed.01.inward.loop.wood.01.green";
            hue1 = 70;
            break;
        case "radiant":
            animation1 = "jb2a.aura_themed.01.inward.complete.wood.01.red";
            animation2 = "jb2a.aura_themed.01.inward.loop.wood.01.red";
            hue1 = 70;
            break;
    };

    new Sequence()

        .effect()
        .file(animation1)
        .attachTo(workflow.token)
        .size(6.6, { gridUnits: true })
        .belowTokens()
        .opacity(0.85)
        .filter("ColorMatrix", { hue: hue1 })

        .wait(500)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .effect()
        .file(animation2)
        .attachTo(workflow.token)
        .size(6.6, { gridUnits: true })
        .delay(1500)
        .fadeOut(1500)
        .belowTokens()
        .opacity(0.85)
        .filter("ColorMatrix", { hue: hue1 })
        .persist()
        .name(`${workflow.token.document.name} SpiShr`)

        .play()
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
    let effectData = {
        'name': "Spirit Shroud: Healing",
        'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are unable to regain hitpoints until the start of ${workflow.token.document.name}'s next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': 'healing',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource', 'combatEnd']
            },
        }
    };
    await mba.createEffect(workflow.targets.first().actor, effectData);
}

async function slow(token, origin) {
    let target = game.canvas.tokens.get(game.combat.current.tokenId);
    if (!target) return;
    if (target.document.disposition === token.document.disposition) return;
    if (mba.getDistance(token, target) > 10) return;
    let effect = mba.findEffect(target.actor, "Spirit Shroud: Slow");
    if (effect) await mba.removeEffect(effect);
    let effectData = {
        'name': "Spirit Shroud: Slow",
        'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
        'origin': origin.actor.uuid,
        'description': `
            <p>Your speed is reduced by 10 feet until the start of ${token.document.name}'s next turn.</p>
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
                'specialDuration': ['turnStartSource', 'combatEnd'],
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