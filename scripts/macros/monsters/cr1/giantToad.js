import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function biteCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = workflow.actor.effects.filter(e => e.name.includes("Giant Toad: Grapple") && e.name != "Grappled");
    if (!effects.length) return;
    if (!mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) {
        ui.notifications.warn("You can only attack the grappled target!");
        return false;
    }
}

async function swallowItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.warn("Target is too big to swallow!");
        return;
    }
    let effects = workflow.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive");
    if (effects.length) {
        ui.notifications.warn("You can't swallow another target!");
        return;
    }
    let grappleEffect = await mba.findEffect(target.actor, "Giant Toad: Grapple");
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.giantToad?.swallow?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Giant Toad: Swallow");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `Swallow (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
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
                    'giantToad': {
                        'swallow': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    async function effectMacroDelTarget() {
        if (!mbaPremades.helpers.findEffect(token.actor, "Prone")) await mbaPremades.helpers.addCondition(token.actor, "Prone");
    };
    let effectDataTarget = {
        'name': "Giant Toad: Swallow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You've been swallowed by Giant Toad.</p>
            <p>While swallowed, you are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} and @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained}, have total cover against attacks and other effects outside the Toad, and take 3d6 acid damage at the start of each of the Giant Toad's turns.</p>
            <p>If the Giant Toad dies, you are no longer @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by it and can escape from the corpse using 5 feet of movement, exiting @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            }
        }
    };
    let distance = await mba.getDistance(workflow.token, target);
    if (grappleEffect) await mba.removeEffect(grappleEffect);
    await warpgate.wait(100);
    await mba.pushToken(workflow.token, target, -distance);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

async function swallowTurnStart(token) {
    let effects = token.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive");
    if (!effects.length) return;
    let targetUuids = [];
    for (let effect of effects) {
        let swallowEffect = await mba.findEffect(token.actor, effect.name);
        targetUuids.push(swallowEffect.flags['mba-premades']?.feature?.giantToad?.swallow?.targetUuid);
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Giant Toad Swallow: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Giant Toad: Acid Stomach";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
}

export let giantToad = {
    'biteCheck': biteCheck,
    'swallowItem': swallowItem,
    'swallowTurnStart': swallowTurnStart
}