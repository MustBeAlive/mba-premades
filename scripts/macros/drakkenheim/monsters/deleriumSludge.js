import {constants} from "../../generic/constants.js";
import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";

async function engulfCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = mba.findNearby(workflow.token, 1, "any", false, false, false, true);
    if (!targets.length) {
        ui.notifications.warn("No nearby targets!");
        return false;
    }
    let targetIds = [];
    for (let target of targets) {
        if (mba.findEffect(target.actor, `${workflow.token.document.name}: Engulf`)) continue;
        targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
}

async function engulfItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.saves.size) {
        for (let target of Array.from(workflow.saves)) await mba.pushToken(workflow.token, target, 5);
    }
    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        async function effectMacroDelTarget() {
            let originDoc = await fromUuid(effect.changes[0].value);
            let sludgeToken = originDoc._object;
            await mbaPremades.helpers.pushToken(sludgeToken, token, 5);
            let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Engulf (${token.document.name})`);
            if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
        };
        let effectDataTarget = {
            'name': `${workflow.token.document.name}: Engulf`,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': 'flags.mba-premades.feature.grapple.origin',
                    'mode': 5,
                    'value': workflow.token.document.uuid,
                    'priority': 20
                },
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
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=14, saveMagic=false, name=Grapple: Action Save (DC14), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': false,
                    'specialDuration': ['combatEnd']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDelTarget)
                    }
                },
                'mba-premades': {
                    'feature': {
                        'engulf': {
                            'originName': workflow.token.document.name
                        }
                    }
                }
            }
        };
        async function effectMacroDelSource() {
            let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.engulf?.targetUuid);
            let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Engulf`);
            if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
        };
        let effectDataSource = {
            'name': `${workflow.token.document.name}: Engulf (${target.document.name})`,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'flags': {
                'dae': {
                    'specialDuration': ['zeroHP', 'combatEnd']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDelSource)
                    }
                },
                'mba-premades': {
                    'feature': {
                        'engulf': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        };
        await mba.createEffect(target.actor, effectDataTarget);
        await mba.createEffect(workflow.actor, effectDataSource);
    }
}

async function engulfTurnStart(token) {
    let effects = token.actor.effects.filter(e => e.name.includes("Engulf") && e.name != "Engulf: Passive");
    if (!effects.length) return;
    let targetUuids = [];
    for (let effect of effects) {
        let targetUuid = effect.flags['mba-premades']?.feature?.engulf?.targetUuid;
        targetUuids.push(targetUuid);
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Delerium Sludge: Engulf", false);
    if (!featureData) return;
    featureData.name = "Engulf: Turn Start";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    for (let target of Array.from(featureWorkflow.failedSaves)) await contamination.addContamination(target);
}

export let deleriumSludge = {
    'engulfCheck': engulfCheck,
    'engulfItem': engulfItem,
    'engulfTurnStart': engulfTurnStart
}