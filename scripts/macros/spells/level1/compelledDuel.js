import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroTarget() {
        await mbaPremades.macros.compelledDuel.end(effect);
    }
    async function effectMacroSource() {
        await mbaPremades.macros.compelledDuel.turnEnd(effect, token, origin);
    }
    const effectDataTarget = {
        'name': 'Compelled Duel: Target',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.compelledDuel.attack,preAttackRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'compelledDuel': {
                        'sourceUuid': workflow.token.document.uuid
                    }
                }
            },
            'effectmacro': {
                'onCombatEnd': {
                    'script': mba.functionToString(effectMacroTarget)
                }
            }
        }
    };
    const effectDataSource = {
        'name': 'Compelled Duel: Source',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.compelledDuel.attacker,postActiveEffects',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'compelledDuel': {
                        'targetUuid': target.document.uuid
                    }
                }
            },
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroSource)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.rune.02.complete.06.pink")
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .fadeIn(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.complete.06.pink")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .fadeIn(1000)

        .wait(800)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectDataSource);
            mba.createEffect(target.actor, effectDataTarget);
        })

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let effect = mba.findEffect(workflow.actor, 'Compelled Duel: Target');
    if (!effect) return;
    if (!effect.origin) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'compelledDuel', 50);
    if (!queueSetup) return;
    let origin = await fromUuid(effect.origin);
    if (!origin) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let targetUuid = workflow.targets.first().document.uuid;
    let sourceUuid = effect.flags['mba-premades']?.spell?.compelledDuel?.sourceUuid;
    if (!sourceUuid) return;
    if (targetUuid === sourceUuid) {
        queue.remove(workflow.item.uuid);
        return;
    }
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add(`DIS: Compelled Duel`);
    queue.remove(workflow.item.uuid);
}

async function attacker({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.token);
    if (!workflow.targets.size) return;
    let effect = mba.findEffect(workflow.actor, 'Compelled Duel: Source');
    if (!effect) return;
    let targetUuid = effect.flags['mba-premades']?.spell?.compelledDuel?.targetUuid;
    if (!targetUuid) return;
    let endSpell = false;
    for (let i of Array.from(workflow.targets)) {
        if (constants.attacks.includes(workflow.item.actionType)) {
            if (i.document.uuid != targetUuid) {
                endSpell = true;
                break;
            } else {
                continue;
            }
        }
        let disposition = i.document.disposition;
        if (disposition != workflow.token.document.disposition) {
            if (i.document.uuid != targetUuid) {
                endSpell = true;
                break;
            }
        }
    }
    if (!endSpell) return;
    await mba.removeEffect(effect);
    let targetToken = await fromUuid(targetUuid);
    if (!targetToken) return;
    let effect2 = mba.findEffect(targetToken.actor, 'Compelled Duel: Target');
    if (!effect2) return;
    await mba.removeEffect(effect2);
}

async function attacked(workflow) {
    if (!workflow.token || !workflow.targets.size) return;
    for (let token of Array.from(workflow.targets)) {
        let effect = mba.findEffect(token.actor, 'Compelled Duel: Target');
        if (!effect) continue;
        if (token.document.disposition === workflow.token.document.disposition) continue;
        let sourceUuid = effect.flags['mba-premades']?.spell?.compelledDuel?.sourceUuid;
        if (!sourceUuid) continue;
        if (workflow.token.document.uuid === sourceUuid) continue;
        await mba.removeEffect(effect);
        let sourceToken = await fromUuid(sourceUuid);
        if (!sourceToken) continue;
        let effect2 = mba.findEffect(sourceToken.actor, 'Compelled Duel: Source');
        if (!effect2) continue;
        await mba.removeEffect(effect2);
    }
}

async function movement(token, updates, diff, id) {
    if (!mba.isLastGM()) return;
    if (token.parent.id != canvas.scene.id) return;
    if (!updates.x && !updates.y && !updates.elevation || !diff.animate) return;
    let effect = mba.findEffect(token.actor, 'Compelled Duel: Target');
    if (!effect) return;
    let sourceUuid = effect.flags['mba-premades']?.spell?.compelledDuel?.sourceUuid;
    if (!sourceUuid) return;
    let sourceToken = fromUuidSync(sourceUuid);
    if (!sourceToken) return;
    let fakeTargetToken = {
        'width': token.width,
        'height': token.height,
        'x': diff['mba-premades'].coords.previous.x,
        'y': diff['mba-premades'].coords.previous.y,
        'elevation': diff['mba-premades'].coords.previous.elevation
    };
    let oldDistance = mba.getCoordDistance(sourceToken.object, fakeTargetToken);
    await token.object?._animation;
    let distance = mba.getDistance(sourceToken, token);
    if (oldDistance >= distance || distance <= 30) return;
    let turnCheck = mba.perTurnCheck(effect, 'spell', 'compelledDuel');
    if (!turnCheck) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Compelled Duel: Moved', false);
    if (!featureData) return;
    delete featureData._id;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    featureData.system.save.dc = mba.getSpellDC(originItem);
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let spellWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!spellWorkflow.failedSaves.size) {
        await mba.setTurnCheck(effect, 'spell', 'compelledDuel');
        return;
    }
    await new Sequence()

        .animation()
        .delay(800)
        .on(token)
        .fadeOut(200)

        .effect()
        .file('jb2a.misty_step.01.red')
        .atLocation(token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(token)
        .teleportTo(fakeTargetToken)
        .snapToGrid()
        .waitUntilFinished(200)

        .effect()
        .file('jb2a.misty_step.02.red')
        .atLocation(token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(token)
        .fadeIn(200)

        .play();
}

async function end(effect) {
    await mba.setTurnCheck(effect, 'spell', 'compelledDuel', true);
}

async function turnEnd(effect, token, origin) {
    let targetUuid = effect.flags['mba-premades']?.spell?.compelledDuel?.targetUuid;
    if (!targetUuid) return;
    let targetToken = await fromUuid(targetUuid);
    if (!targetToken) return;
    let distance = mba.getDistance(token, targetToken);
    if (distance <= 30) return;
    let selection = await mba.remoteDialog(origin.name, constants.yesNo, mba.lastGM(), 'Caster has ended their turn more than 30 feet away from their target. Remove effect?');
    if (!selection) return;
    await mba.removeEffect(effect);
    let targetEffect = mba.findEffect(targetToken.actor, 'Compelled Duel: Target');
    if (!targetEffect) return;
    await mba.removeEffect(targetEffect);
}

export let compelledDuel = {
    'attack': attack,
    'attacker': attacker,
    'attacked': attacked,
    'movement': movement,
    'item': item,
    'end': end,
    'turnEnd': turnEnd
};