import {mba} from "../../../helperFunctions.js";

// To do: animations; better icon?

export async function foresight({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Foresight: Counter");
    if (oldEffect) {
        let targetDoc = await fromUuid(oldEffect.flags['mba-premades']?.spell?.foresight?.targetUuid);
        if (!targetDoc) {
            ui.notifications.warn("Unable to find old target!");
            return;
        }
        let targetEffect = await mba.findEffect(targetDoc.actor, "Foresight");
        if (targetEffect) {
            await mba.removeEffect(targetEffect);
            await mba.removeEffect(oldEffect);
        }
    }
    let target = workflow.targets.first();
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Foresi` });
        let originDoc = await fromUuid(effect.flags['mba-premades']?.spell?.foresight?.originUuid);
        if (!originDoc) {
            ui.notifications.warn("Unable to find origin!");
            return; 
        }
        let counterEffect = await mbaPremades.helpers.findEffect(originDoc.actor, "Foresight: Counter");
        if (counterEffect) await mbaPremades.helpers.removeEffect(counterEffect);
    };
    let effectDataTarget = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you cannot be surprised and has advantage on attack rolls, ability checks, and saving throws.</p>
            <p>Additionally, other creatures have disadvantage on attack rolls against you.</p>
        `,
        'duration': {
            'seconds': 28800
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.check.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'spell': {
                    'foresight': {
                        'originUuid': workflow.token.document.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 9,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effectDataSource = {
        'name': "Foresight: Counter",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': false
            },
            'mba-premades': {
                'spell': {
                    'foresight': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}