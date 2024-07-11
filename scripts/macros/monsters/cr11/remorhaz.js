import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function biteCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effects = workflow.actor.effects.filter(i => i.name.includes("Grapple"));
    if (effects.length) {
        ui.notifications.warn("You can't bite another target! (swallow someone or release the grapple)");
        return false;
    }
}

async function swallowCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`);
    if (!effect) {
        ui.notifications.warn("You can only attempt to swallow target you are currently grappling!");
        return false;
    }
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.warn("Target is too big to swallow!");
        return;
    }
}

async function swallowItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let grappleEffect = await mba.findEffect(target.actor, "Remorhaz: Grapple");
    if (!grappleEffect) {
        ui.notifications.warn("Unable to find grapple effect!");
        return;
    }
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.remorhaz?.swallow?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Remorhaz: Swallow");
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
                    'remorhaz': {
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
        'name': "Remorhaz: Swallow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You've been swallowed by Remorhaz.</p>
            <p>While swallowed, you are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} and @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained}, have total cover against attacks and other effects outside the Remorhaz, and take 6d6 acid damage at the start of each of the Remorhaz's turns.</p>
            <p>If the Remorhaz takes 30 damage or more on a single turn from a creature inside it, the Remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn.</p>
            <p>On a failed save, Remorhaz regurgitates all swallowed creatures, which fall @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone} in a space within 10 feet of the Remorhaz.</p>
            <p>If the Remorhaz dies, you are no longer @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by it and can escape from the corpse using 15 feet of movement, exiting @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
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
    await mba.removeEffect(grappleEffect);
    await warpgate.wait(100);
    await mba.pushToken(workflow.token, target, -distance);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

async function swallowTurnStart(token) {
    let effect = await mba.findEffect(token.actor, "Swallow: Passive");
    if (!effect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'remorhaz': {
                        'swallow': {
                            'damageTaken': 0,
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    let effects = token.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive" && e.name != "Swallow: Save");
    if (!effects.length) return;
    let targetUuids = [];
    for (let effect of effects) {
        let swallowEffect = await mba.findEffect(token.actor, effect.name);
        targetUuids.push(swallowEffect.flags['mba-premades']?.feature?.remorhaz?.swallow?.targetUuid);
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Remorhaz Swallow: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Remorhaz: Acid Stomach";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function swallowDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [remorhazToken] = Array.from(workflow.targets).filter(t => t.document.name === "Remorhaz");
    if (mba.findEffect(remorhazToken.actor, "Swallow: Save")) return;
    let check = await mba.findEffect(remorhazToken.actor, `Swallow (${workflow.token.name})`);
    if (!check) return;
    let effect = await mba.findEffect(remorhazToken.actor, "Swallow: Passive");
    let damageTaken = effect.flags['mba-premades']?.feature?.remorhaz?.swallow?.damageTaken;
    damageTaken += workflow.damageItem.appliedDamage;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'remorhaz': {
                        'swallow': {
                            'damageTaken': damageTaken,
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    if (damageTaken < 30) return;
    else {
        async function effectMacroTurnEnd() {
            let saveEffect = await mbaPremades.helpers.findEffect(token.actor, "Swallow: Save");
            let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "con");
            if (saveRoll.total >= 15) {
                await mbaPremades.helpers.removeEffect(saveEffect);
                return;
            }
            else {
                let effects = token.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive" && e.name != "Swallow: Save");
                if (!effects.length) {
                    ui.notifications.warn("Failed to find origin swallow effects!");
                    return;
                }
                for (let effect of effects) {
                    let swallowEffect = await mbaPremades.helpers.findEffect(token.actor, effect.name);
                    let targetDoc = await fromUuid(swallowEffect.flags['mba-premades']?.feature?.remorhaz?.swallow?.targetUuid);
                    mbaPremades.helpers.pushToken(token, targetDoc.object, 10);
                    await mbaPremades.helpers.removeEffect(swallowEffect);
                }
                await mbaPremades.helpers.removeEffect(saveEffect);
            }
        }
        let effectData = {
            'name': "Swallow: Save",
            'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroTurnEnd)
                    }
                }
            }
        };
        await mba.createEffect(remorhazToken.actor, effectData);
    }
}

export let remorhaz = {
    'biteCheck': biteCheck,
    'swallowCheck': swallowCheck,
    'swallowItem': swallowItem,
    'swallowTurnStart': swallowTurnStart,
    'swallowDamaged': swallowDamaged
}