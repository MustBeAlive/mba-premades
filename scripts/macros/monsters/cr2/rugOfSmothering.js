import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: descriptions, animations

async function smother({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) return;
    if (mba.findEffect(target.actor, "Smother: Target")) return;
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.rugOfSmothering?.smother?.targetUuid);
        if (!targetDoc) return;
        await mbaPremades.helpers.pushToken(token, targetDoc.object, 5);
        let effectTarget = await mbaPremades.helpers.findEffect(targetDoc.actor, "Smother: Target");
        if (effectTarget) await mbaPremades.helpers.removeEffect(effectTarget);
    };
    let effectDataSource = {
        'name': `Smother: Source`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'changes': [
            {
                'key': 'system.traits.dr.all',
                'mode': 0,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.feature.rugOfSmothering.smother.targetUuid',
                'mode': 5,
                'value': target.document.uuid,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.feature.onHit.rugOfSmothering',
                'mode': 5,
                'value': true,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'rugOfSmothering': {
                        'smother': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            },
        }
    };
    async function effectMacroDelTarget() {
        let sourceDoc = await fromUuid(effect.flags['mba-premades']?.feature?.rugOfSmothering?.smother?.sourceUuid);
        if (!sourceDoc) return;
        let effectSource = await mbaPremades.helpers.findEffect(sourceDoc.actor, "Smother: Source");
        if (effectSource) await mbaPremades.helpers.removeEffect(effectSource);
    };
    let effectDataTarget = {
        'name': "Smother: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=bludgeoning, damageRoll=2d6 + 3, name=Smother: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Grapple: Action Save (DC13), killAnim=true`,
                'priority': 20
            }
        ],
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
                    'rugOfSmothering': {
                        'smother': {
                            'sourceUuid': workflow.token.document.uuid
                        }
                    }
                }
            },
        }
    };
    await mba.pushToken(workflow.token, target, -5);
    await mba.createEffect(workflow.actor, effectDataSource);
    await mba.createEffect(target.actor, effectDataTarget);
}

async function onHit(workflow, targetToken) {
    if (workflow.hitTargets.size === 0 || !workflow.damageList) return;
    let effect = mba.findEffect(targetToken.actor, "Smother: Source");
    if (!effect) return;
    let bondTokenUuid = targetToken.actor.flags['mba-premades']?.feature?.rugOfSmothering?.smother?.targetUuid;
    if (!bondTokenUuid) return;
    let damageInfo = workflow.damageList.find(list => list.actorId === targetToken.actor.id);
    if (!damageInfo) return;
    if (damageInfo.appliedDamage === 0) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Rug of Smothering: Damage Transfer", false);
    if (!featureData) return;
    featureData.system.damage.parts = [[damageInfo.appliedDamage + '[none]', 'none']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetToken.actor });
    let sourceToken = await fromUuid(bondTokenUuid);
    if (!sourceToken) return;
    let [config, options] = constants.syntheticItemWorkflowOptions([sourceToken.uuid]);
    let damageWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (damageWorkflow.targets.first().actor.system.attributes.hp.value != 0) return;
    await mba.removeEffect(effect);
    let sourceEffect = mba.getEffects(sourceToken.actor).find(e => e.flags['mba-premades']?.feature?.rugOfSmothering?.smother?.sourceUuid === targetToken.document.uuid);
    if (!sourceEffect) return;
    await mba.removeEffect(sourceEffect);
}

export let rugOfSmothering = {
    'smother': smother,
    'onHit': onHit
}