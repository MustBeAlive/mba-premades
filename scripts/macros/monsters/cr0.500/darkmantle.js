import {mba} from "../../../helperFunctions.js";

async function crushCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceEffect = await mba.findEffect(workflow.actor, "Darkmantle: Attached");
    if (!sourceEffect) return;
    let targetEffect = await mba.findEffect(workflow.targets.first().actor, "Darkmantle: Crush");
    if (targetEffect) return;
    ui.notifications.warn("You can only attack the target you are attached to!");
    return false;
}

async function crushItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let sourceEffect = await mba.findEffect(workflow.actor, "Darkmantle: Attached");
    let targetEffect = await mba.findEffect(target.actor, "Darkmantle: Crush");
    if (sourceEffect && targetEffect) {
        if (mba.findEffect(target.actor, "Blinded")) return;
        if (!workflow.advantage || mba.getSize(target.actor) > 2) return;
        let updatesSource = {
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'system.attributes.movement.all',
                    'mode': 0,
                    'value': "*0",
                    'priority': 20
                }
            ]
        };
        let updatesTarget = {
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Blinded",
                    'priority': 20
                }
            ]
        };
        await mba.updateEffect(sourceEffect, updatesSource);
        await mba.updateEffect(targetEffect, updatesTarget);
        return;
    }
    let descriptionTarget = `
        <p>Darkmantle is attached to you and has advantage on attack rolls against you.</p>
        <p>As an action, you can make a Strength ability check (DC13).</p>
        <p>On a success, the darkmantle is detached.</p>
    `;
    let changesTarget = [
        {
            'key': 'flags.midi-qol.OverTime',
            'mode': 0,
            'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=13, saveMagic=false, name=Crush: Action Save, killAnim=true`,
            'priority': 20
        }
    ];
    if (workflow.advantage) {
        descriptionTarget = `
            <p>Darkmantle is attached to your head. While it is attached this way, you are unable to breathe and are blinded.</p>
            <p>As an action, you can make a Strength ability check (DC13).</p>
            <p>On a success, the darkmantle is detached.</p>
        `;
        changesTarget = [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=13, saveMagic=false, name=Crush: Action Save (DC 13), killAnim=true`,
                'priority': 20
            }
        ];
    }
    async function effectMacroDelSource() {
        let vaildTargets = game.scenes.current.tokens.filter(i => i.actor.effects.some(i => i.name === ("Darkmantle: Crush")));
        if (!vaildTargets.length) return;
        for (let target of vaildTargets) {
            let effect = await mbaPremades.helpers.findEffect(target.actor, "Darkmantle: Crush");
            if (token.uuid != effect.flags['mba-premades']?.feature?.darkmantle?.crush?.sourceUuid) return;
            await mbaPremades.helpers.removeEffect(effect);
        }
    }
    const effectDataSource = {
        'name': "Darkmantle: Attached",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Attached to: <b>${target.document.name}</b>`,
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
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'darkmantle': {
                        'chrush': {
                            'sourceUuid': workflow.token.document.uuid,
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    async function effectMacroDelTarget() {
        let vaildTargets = game.scenes.current.tokens.filter(i => i.actor.effects.some(i => i.name === ("Darkmantle: Attached")));
        if (!vaildTargets.length) return;
        for (let target of vaildTargets) {
            let effect = await mbaPremades.helpers.findEffect(target.actor, "Darkmantle: Attached");
            if (token.uuid != effect.flags['mba-premades']?.feature?.darkmantle?.crush?.targetUuid) return;
            await mbaPremades.helpers.removeEffect(effect);
        }
    }
    const effectDataTarget = {
        'name': "Darkmantle: Crush",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': descriptionTarget,
        'changes': changesTarget,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'darkmantle': {
                        'chrush': {
                            'sourceUuid': workflow.token.document.uuid,
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectDataSource);
    await mba.createEffect(target.actor, effectDataTarget)
}

async function detach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Darkmantle: Attached");
    if (effect) await mba.removeEffect(effect);
}

export let darkmantle = {
    'crushCast': crushCast,
    'crushItem': crushItem,
    'detach': detach
}