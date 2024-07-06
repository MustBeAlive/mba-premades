import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Wretched Sorrowsworn: Attach`);
    if (effect) {
        ui.notifications.warn("Wretched Sorrowsworn is attached to someone and can't use it's attack!");
        return false;
    }
}

async function attach({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await mba.findEffect(workflow.actor, `Wretched Sorrowsworn: Attach`);
    if (effect) return;
    async function effectMacroStart() {
        let effect = await mbaPremades.helpers.findEffect(token.actor, "Wretched Sorrowsworn: Attach");
        if (!effect) return;
        let target = await fromUuid(effect.flags['mba-premades']?.feature?.wretchedSorrowsworn?.targetUuid);
        let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Monster Features', 'Wretched Sorrowsworn: Turn Start', false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    let effectData = {
        'name': "Wretched Sorrowsworn: Attach",
        'icon': "icons/magic/unholy/strike-beam-blood-red-green.webp",
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStart)
                }
            },
            'mba-premades': {
                'feature': {
                    'wretchedSorrowsworn': {
                        'targetUuid': workflow.targets.first().document.uuid,
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function detach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Wretched Sorrowsworn: Attach`);
    if (effect) await mba.removeEffect(effect);
}

async function wretchedPackTactics({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let nearbyTargets = mba.findNearby(workflow.targets.first(), 5, 'enemy', false).filter(i => i.document.uuid != workflow.token.document.uuid && !mba.findEffect(i.actor, "Incapacitated"));
    if (!nearbyTargets.length) {
        let queueSetup = await queue.setup(workflow.item.uuid, 'wretchedPackTactics', 150);
        if (!queueSetup) return;
        workflow.disadvantage = true;
        workflow.advReminderAttackAdvAttribution.add("DIS:Wretched Pack Tactics");
        queue.remove(workflow.item.uuid);
        return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'wretchedPackTactics', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Wretched Pack Tactics");
    queue.remove(workflow.item.uuid);
}

export let wretchedSorrowsworn = {
    'check': check,
    'attach': attach,
    'detach': detach,
    'wretchedPackTactics': wretchedPackTactics
}