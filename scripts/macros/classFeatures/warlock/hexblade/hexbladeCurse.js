import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

// To do: descriptions

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDelSource() {
        let targetTokenId = effect.changes[0].value;
        let target = canvas.scene.tokens.get(targetTokenId);
        if (!target) return;
        let targetEffect = await mbaPremades.helpers.findEffect(target.actor, "Hexblade's Curse: Target");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.mba-premades.feature.hexbladeCurse',
                'mode': 5,
                'value': target.id,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.hexbladeCurse.damage,postDamageRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.hexbladeCurse.damageApplication,preDamageApplication',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.hexbladeCurse.attack,preambleComplete',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP'],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'hexbladeCurse': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    }
    async function effectMacroDelTarget() {
        await mbaPremades.macros.hexbladeCurse.removed(origin);
    };
    async function effectMacroDefeated() {
        await mbaPremades.macros.hexbladeCurse.defeated(origin, effect);
    };
    let effectDataTarget = {
        'name': "Hexblade's Curse: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                },
                'onCombatantDefeated': {
                    'script': mba.functionToString(effectMacroDefeated)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target, { followRotation: false })
        .scale(0.15)
        .playbackRate(1)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { brightness: -1 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(target, { followRotation: false })
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .filter("ColorMatrix", { brightness: -1 })
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target, { followRotation: false })
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectDataSource);
            await mba.createEffect(target.actor, effectDataTarget);
        })

        .play();
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1 || !constants.attacks.includes(workflow.item.system.actionType)) return;
    let targetId = workflow.actor.flags['mba-premades']?.feature?.hexbladeCurse;
    if (!targetId) return;
    if (workflow.targets.first().id != targetId) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'hexbladeCurse', 250);
    if (!queueSetup) return;
    let effectData = {
        'name': 'Critical Threshold',
        'icon': 'modules/mba-premades/icons/class/warlock/critical_threshold.webp',
        'changes': [
            {
                'key': 'flags.midi-qol.grants.criticalThreshold',
                'value': '19',
                'mode': 5,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isAttacked'],
                'stackable': 'multi',
                'macroRepeat': 'none'
            }
        }
    };
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target, { followRotation: false })
        .scale(0.15)
        .playbackRate(1)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { brightness: -1 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(target, { followRotation: false })
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .filter("ColorMatrix", { brightness: -1 })
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target, { followRotation: false })
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            queue.remove(workflow.item.uuid);
        })

        .play();
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1) return;
    let targetId = workflow.actor.flags['mba-premades']?.feature?.hexbladeCurse;
    if (!targetId) return;
    let target = workflow.hitTargets.first();
    if (targetId != target.id) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'hexbladeCurse', 250);
    if (!queueSetup) return;
    let defaultDamageType = workflow.defaultDamageType;
    let bonusDamageFormula = `${workflow.actor.system.attributes.prof}[${defaultDamageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
    return;
}

async function damageApplication({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size < 2) return;
    let targetId = workflow.actor.flags['mba-premades']?.feature?.hexbladeCurse;
    if (!targetId) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'hexbladeCurse', 250);
    if (!queueSetup) return;
    let targetDamage = workflow.damageList.find(i => i.tokenId === targetId);
    if (!targetDamage) return;
    let target = canvas.scene.tokens.get(targetDamage.tokenId);
    if (!target) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let hasDI = mba.checkTrait(target.actor, 'di', workflow.defaultDamageType);
    if (hasDI) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageTotal = workflow.actor.system.attributes.prof;
    let hasDR = mba.checkTrait(target.actor, 'dr', workflow.defaultDamageType);
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    targetDamage.damageDetail[0].push(
        {
            'damage': damageTotal,
            'type': workflow.defaultDamageType
        }
    );
    targetDamage.totalDamage += damageTotal;
    targetDamage.appliedDamage += damageTotal;
    targetDamage.hpDamage += damageTotal;
    if (targetDamage.oldTempHP > 0) {
        if (targetDamage.oldTempHP >= damageTotal) {
            targetDamage.newTempHP -= damageTotal;
        } else {
            let leftHP = damageTotal - targetDamage.oldTempHP;
            targetDamage.newTempHP = 0;
            targetDamage.newHP -= leftHP;
        }
    } else {
        targetDamage.newHP -= damageTotal;
    }
    queue.remove(workflow.item.uuid);
}

async function defeated(origin, effect) {
    await warpgate.wait(100);
    let warlockLevels = origin.actor.classes.warlock?.system?.levels;
    if (warlockLevels >= 14) {
        async function effectMacro() {
            let validTargets = await mbaPremades.helpers.findNearby(token, 30, "enemy", false, false);
            if (validTargets.length) {
                await mbaPremades.helpers.playerDialogMessage();
                let selection = await mbaPremades.helpers.dialog('Master of Hexes', [['Apply healing as usual', true], ["Apply Hexblade's Curse to new target within 30ft", false]], "<b>What would you like to do?</b>");
                await mbaPremades.helpers.clearPlayerDialogMessage();
                if (selection) {
                    let damage = Math.max(origin.actor.system.abilities.cha.mod, 1);
                    let warlockLevels = origin.actor.classes.warlock?.system?.levels;
                    if (warlockLevels) damage += warlockLevels;
                    await mbaPremades.helpers.applyDamage(token, damage, 'healing');
                    let targetEffect = mbaPremades.helpers.findEffect(actor, "Hexblade's Curse: Target");
                    if (targetEffect) await mbaPremades.helpers.removeEffect(effect);
                }
                else {
                    await mbaPremades.helpers.playerDialogMessage();
                    let selection2 = await mbaPremades.helpers.selectTarget("Hexblade's Curse", mbaPremades.constants.okCancel, validTargets, true, 'one', undefined, false, "Select target to curse:");
                    await mbaPremades.helpers.clearPlayerDialogMessage();
                    if (!selection2.buttons) return;
                    let targetUuid = selection2.inputs.find(i => i);
                    if (!targetUuid) return;
                    let options = {
                        'showFullCard': true,
                        'createWorkflow': true,
                        'targetUuids': [targetUuid],
                        'configureDialog': false,
                        'versatile': false,
                        'consumeResource': false,
                        'consumeSlot': false,
                        'workflowOptions': {
                            'autoRollDamage': 'always',
                            'autoFastDamage': true
                        }
                    };
                    await MidiQOL.completeItemUse(origin, {}, options);
                }
            } 
            else {
                let damage = Math.max(origin.actor.system.abilities.cha.mod, 1);
                let warlockLevels = origin.actor.classes.warlock?.system?.levels;
                if (warlockLevels) damage += warlockLevels;
                await mbaPremades.helpers.applyDamage(token, damage, 'healing');
                let targetEffect = mbaPremades.helpers.findEffect(actor, "Hexblade's Curse: Target");
                if (targetEffect) await mbaPremades.helpers.removeEffect(effect);
            }
            await effect.delete();
        }
        let effectData = {
            'name': origin.name + ': Healing',
            'icon': origin.img,
            'origin': origin.uuid,
            'duration': {
                'seconds': 1
            },
            'flags': {
                'effectmacro': {
                    'onCreate': {
                        'script': mba.functionToString(effectMacro)
                    }
                }
            }
        }
        await mba.createEffect(origin.actor, effectData);
        await mba.removeEffect(effect);
        return;
    }
    let damage = Math.max(origin.actor.system.abilities.cha.mod, 1);
    if (warlockLevels) damage += warlockLevels;
    let tokens = origin.actor.getActiveTokens();
    if (tokens.length != 0) await mba.applyDamage(tokens[0], damage, 'healing');
    await mba.removeEffect(effect);
}

async function removed(origin) {
    let targetEffect = mba.findEffect(origin.actor, origin.name);
    if (targetEffect) await mba.removeEffect(targetEffect);
}

export let hexbladeCurse = {
    'item': item,
    'damage': damage,
    'damageApplication': damageApplication,
    'attack': attack,
    'defeated': defeated,
    'removed': removed
}