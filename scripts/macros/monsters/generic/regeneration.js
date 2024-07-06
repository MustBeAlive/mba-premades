import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function onHit(workflow, targetToken) {
    if (!workflow.damageRoll || !workflow.hitTargets.has(targetToken)) return;
    let regenEffect = mba.findEffect(targetToken.actor, 'Regeneration');
    if (!regenEffect) return;
    let blockEffect = mba.findEffect(targetToken.actor, 'Regeneration: Blocked');
    if (blockEffect) return;
    let originItem = regenEffect.parent;
    if (!originItem) return;
    let stopHeal = false;
    let reducedHeal = false;
    let hp = targetToken.actor.system.attributes.hp.value;
    let oldHP = workflow.damageList.find(i => i.tokenUuid === targetToken.document.uuid).oldHP;
    let damageKey = regenEffect.changes.filter(i => i.key === "flags.mba-premades.regeneration.damageType");
    let critKey = regenEffect.changes.filter(i => i.key === "flags.mba-premades.regeneration.crit");
    let thresholdKey = regenEffect.changes.filter(i => i.key === "flags.mba-premades.regeneration.threshold");
    let zeroHPKey = regenEffect.changes.filter(i => i.key === "flags.mba-premades.regeneration.zeroHP");
    let damageTypes = damageKey[0].value;
    for (let i of Object.keys(CONFIG.DND5E.damageTypes).filter(i => i != 'midi-none')) {
        if (damageTypes.includes(i) && mba.getRollDamageTypes(workflow.damageRoll).has(i) && !mba.checkTrait(targetToken.actor, 'di', i)) {
            if (thresholdKey.length) {
                let threshold = thresholdKey[0].value;
                if (oldHP != 0) {
                    reducedHeal = true;
                    continue;
                } else {
                    if (mba.totalDamageType(targetToken.actor, workflow.damageDetail, i) >= threshold) {
                        reducedHeal = false;
                        stopHeal = true;
                        break;
                    }
                    reducedHeal = true;
                    continue;
                }

            }
            stopHeal = true;
            reducedHeal = false;
            break;
        }
    }
    if (workflow.isCritical && critKey.length) stopHeal = true;
    if (!stopHeal) {
        let effect = mba.findEffect(targetToken.actor, 'Regeneration: Reduced');
        if (reducedHeal && !effect) {
            let effectData = {
                'name': 'Regeneration: Reduced',
                'icon': "modules/mba-premades/icons/generic/regeneration_reduced.webp",
                'origin': originItem.uuid,
                'duration': {
                    'seconds': 12
                },
            };
            await mba.createEffect(targetToken.actor, effectData);
        }
        if (zeroHPKey.length) return;;
        if (hp < 1 && mba.inCombat()) {
            let updates = {
                'defeated': false
            };
            await mba.updateCombatant(mba.getCombatant(targetToken), updates);
            let effectData = {
                'name': 'Dead?',
                'icon': 'modules/mba-premades/icons/conditions/dead.webp',
                'origin': originItem.uuid,
                'flags': {
                    'dae': {
                        'showIcon': true
                    },
                    'core': {
                        'overlay': true
                    }
                }
            };
            await warpgate.wait(200);
            await mba.createEffect(targetToken.actor, effectData);
            if (!mba.findEffect(targetToken.actor, 'Prone')) await mba.addCondition(targetToken.actor, 'Prone', false, originItem.uuid);
            let isDead = await mba.findEffect(targetToken.actor, "Dead");
            if (isDead) await mba.removeEffect(isDead);
        }
        return;
    } else {
        let reduceEffect = mba.findEffect(targetToken.actor, 'Regeneration: Reduced');
        if (reduceEffect) await mba.removeEffect(reduceEffect);
        let hp = targetToken.actor.system.attributes.hp.value;
        if (hp < 1 && mba.inCombat()) {
            let deadEffect = mba.findEffect(targetToken.actor, 'Dead?');
            if (deadEffect) {
                await mba.removeEffect(deadEffect);
                await mba.addCondition(targetToken.actor, 'Dead', true, null);
            }
        }
    }
    let effectData = {
        'name': 'Regeneration: Blocked',
        'icon': "modules/mba-premades/icons/generic/regeneration_blocked.webp",
        'origin': originItem.uuid,
        'duration': {
            'seconds': 12
        },
    };
    await mba.createEffect(targetToken.actor, effectData);

}

async function turnStart(token, origin) {
    const currentHP = token.actor.system.attributes.hp.value;
    let regenEffect = await mba.findEffect(token.actor, "Regeneration");
    let zeroHPKey = regenEffect.changes.filter(i => i.key === "flags.mba-premades.regeneration.zeroHP");
    if (mba.checkTrait(token.actor, 'di', 'healing')) return;
    let blockEffect = mba.findEffect(token.actor, 'Regeneration: Blocked');
    if (blockEffect) {
        if (currentHP < 1) {
            await mba.removeEffect(regenEffect);
            return;
        }
        await mba.removeEffect(blockEffect);
        return;
    }
    if (zeroHPKey.length && currentHP === 0) return;
    let reduceEffect = mba.findEffect(token.actor, 'Regeneration: Reduced');
    let featureData = duplicate(origin.toObject());
    delete featureData._id;
    if (reduceEffect) {
        featureData.system.damage.parts[0][0] = '(' + featureData.system.damage.parts[0][0] + ') / 2';
        await mba.removeEffect(reduceEffect);
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    setProperty(options, 'workflowOptions.allowIncapacitated', true);
    if (currentHP === 0) {
        let deadEffect = mba.findEffect(token.actor, 'Dead?');
        if (deadEffect) {
            await mba.removeEffect(deadEffect);
        }

    }
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(token)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
        })

        .play()
}

export let regeneration = {
    'onHit': onHit,
    'turnStart': turnStart
}