import {mba} from "../../../helperFunctions.js";

async function engulfCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.warn("Target is too big to engulf!");
        return false;
    }
    let effects = workflow.actor.effects.filter(e => e.name.includes("Mantrap: Engulf"));
    if (effects.length) {
        ui.notifications.warn("Mantrap is unable to engulf more than 1 creature!");
        return false;
    }
}

async function engulfItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDelTarget() {
        let originDoc = await fromUuid(effect.changes[0].value);
        await mbaPremades.helpers.pushToken(originDoc.object, token, 5);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Engulf (${token.document.name})`);
        if (originEffect) {
            await mbaPremades.helpers.removeEffect(originEffect);
        }
    };
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Engulf`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.feature.engulf.origin',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
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
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageBeforeSave=true, damageType=acid, damageRoll=4d6, name=Mantrap: Engulf, killAnim=true, fastForwardDamage=true`,
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
    await mba.pushToken(workflow.token, target, -5);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

async function attractivePollenCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.particles.outward.purple.01.01")
        .attachTo(workflow.token)
        .size(12, { gridUnits: true })
        .duration(8000)
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 4000)
        .playbackRate(0.95)

        .play()

    let targetIds = [];
    for (let target of Array.from(workflow.targets)) {
        let type = await mba.raceOrType(target.actor);
        if (mba.findEffect(target.actor, "Mantrap: Attractive Pollen")) continue;
        if (type === "humanoid" || type === "beast") targetIds.push(target.id);
    }
    mba.updateTargets(targetIds);
}

async function attractivePollenItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroTurnStart() {
        await mbaPremades.helpers.playerDialogMessage(mbaPremades.helpers.firstOwner(token));
        await mbaPremades.helpers.dialog("Mantrap: Attractive Pollen", [["Ok!", false]], `
                <p>You are affected by Mantap's Attractive Pollen.</p>
                <p>While affected in this way, you are forced to use all your movement on your turn to get as close to the the mantrap as possible.</p>
                <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
            `);
        await mbaPremades.helpers.clearPlayerDialogMessage();
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AtrPol` })
    };
    let effectData = {
        'name': "Mantrap: Attractive Pollen",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Mantap's Attractive Pollen.</p>
            <p>While affected in this way, you are forced to use all your movement on your turn to get as close to the the mantrap as possible.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=11, saveMagic=false, name=Attactive Pollen: Turn End (DC11), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .effect()
            .file("jb2a.particles.outward.purple.01.02")
            .attachTo(target)
            .scaleToObject(1.3)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} AtrPol`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let mantrap = {
    'engulfCheck': engulfCheck,
    'engulfItem': engulfItem,
    'attractivePollenCast': attractivePollenCast,
    'attractivePollenItem': attractivePollenItem
}