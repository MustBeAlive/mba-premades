
import {mba} from "../../../helperFunctions.js";

async function turnStart(token) {
    let effect = await mba.findEffect(token.actor, "Slam: Passive");
    if (!effect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'shamblingMound': {
                        'slam': {
                            'consecutive': 0,
                            'targetUuid': ""
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.name != "Slam") return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Shambling Mound: Grapple")) return;
    let effect = await mba.findEffect(workflow.actor, "Slam: Passive");
    if (!effect) return;
    let consecutive = effect.flags['mba-premades']?.feature?.shamblingMound?.slam?.consecutive;
    let lastTargetUuid;
    if (consecutive === 0) lastTargetUuid = target.document.uuid;
    else lastTargetUuid = effect.flags['mba-premades']?.feature?.shamblingMound?.slam?.targetUuid;
    if (workflow.hitTargets.size && lastTargetUuid === target.document.uuid) consecutive += 1;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'shamblingMound': {
                        'slam': {
                            'consecutive': consecutive,
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    if (consecutive < 2) return;
    if (mba.getSize(target.actor) > 2) return;
    await mbaPremades.macros.monsters.autoGrapple({ speaker, actor, token, character, item, args, scope, workflow });
    await warpgate.wait(200);
    let feature = await mba.getItem(workflow.actor, "Engulf");
    if (feature) await feature.use();
    return;
}

async function engulf({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.actor, "Engulf")) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.info("Shambling Mound can only engulf medium or smaller creatures!");
        return;
    }
    let grappleEffect = await mba.findEffect(target.actor, "Shambling Mound: Grapple");
    if (grappleEffect) await mba.removeEffect(grappleEffect);
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.shamblingMound?.engulf?.targetUuid);
        if (!targetDoc) return;
        let engulfEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Shambling Mound: Engulf");
        if (engulfEffect) await mbaPremades.helpers.removeEffect(engulfEffect);
        let validTokens = canvas.scene.tokens.filter(t => t.actor.flags['mba-premades']?.feature?.grapple?.origin === token.document.uuid);
        if (!validTokens.length) return;
        for (let target of validTokens) {
            let grappleEffect = await mbaPremades.helpers.findEffect(target.actor, "Shambling Mound: Grapple");
            if (grappleEffect) await mbaPremades.helpers.removeEffect(grappleEffect);
        }
    };
    async function effectMacroTurnStartSource() {
        let targetUuid = effect.flags['mba-premades']?.feature?.shamblingMound?.engulf?.targetUuid;
        let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Monster Features', "Shambling Mound: Engulf (Turn Start)", false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([targetUuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    };
    let effectDataSource = {
        'name': "Engulf",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Target: <u>${target.document.name}</u>`,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStartSource)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'shamblingMound': {
                        'engulf': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    let effectDataTarget = {
        'name': "Shambling Mound: Engulf",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are engulfed inside the Shambling Mound.</p>
            <p>While inside you are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded}, @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} and are unable to breathe.</p>
            <p>Additionally, you must succeed on a DC14 Constitution saving throw at the start of each of the Shambling Mound's turns, or take 2d8 + 4 bludgeoning damage.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Blinded',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            }
        }
    };
    let distance = await mba.getDistance(workflow.token, target, true);
    await mba.pushToken(workflow.token, target, -distance);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

export let shamblingMound = {
    'turnStart': turnStart,
    'attack': attack,
    'engulf': engulf
}