import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, `<b>Choose which targets to keep:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "charmed") || mba.findEffect(target.actor, "Deafened")) {
            await mba.createEffect(target.actor, constants.immunityEffectData);
            continue;
        }
        if (mba.inCombat()) await mba.createEffect(target.actor, constants.advantageEffectData);
    }
    //new Sequence()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroEveryTurnSource() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Enthrall: Source");
        if (!effect) return;
        if (mbaPremades.helpers.findEffect(actor, "Incapacitated") || mbaPremades.helpers.findEffect(actor, "Silence")) await mbaPremades.helpers.removeEffect(effect);
    };
    async function effectMacroEveryTurnTarget() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Enthrall");
        if (!effect) return;
        if (mbaPremades.helpers.findEffect(actor, "Deafened")) await mbaPremades.helpers.removeEffect(effect);
    };
    async function effectMacroDelSource() {
        let targetUuids = effect.flags['mba-premades']?.spell?.enthrall?.targetUuids;
        if (!targetUuids) return;
        for (let targetUuid of targetUuids) {
            let target = await fromUuid(targetUuid);
            let targetEffect = mbaPremades.helpers.findEffect(target.actor, 'Enthrall');
            if (!targetEffect) continue;
            if (effect.origin != targetEffect.origin) continue;
            await mbaPremades.helpers.removeEffect(targetEffect);
        }
    };
    let effectDataSource = {
        'name': "Enthrall: Source",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurnSource)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effectDataTarget = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.skill.prc',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.adv-reminder.message.skill.prc',
                'mode': 2,
                'value': "Enthrall: you have disadvantage on Wisdom [Perception] checks made to perceive any creature other than caster of the Entrall spell until the spell ends or until you can no longer hear the caster.",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurnTarget)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let sourceEffect = await mba.createEffect(workflow.actor, effectDataSource);
    let targetUuids = [];
    for (let target of targets) {
        await mba.createEffect(target.actor, effectDataTarget);
        targetUuids.push(target.document.uuid);
    }
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'enthrall': {
                        'targetUuids': targetUuids
                    }
                }
            }
        }
    };
    await mba.updateEffect(sourceEffect, updates);
}

export let enthrall = {
    'cast': cast,
    'item': item
}