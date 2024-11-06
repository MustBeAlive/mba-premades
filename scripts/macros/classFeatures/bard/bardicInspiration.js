import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let bardLevel = workflow.actor.classes.bard?.system?.levels;
    if (!bardLevel) {
        ui.notifications.warn("Actor has no Bard levels!");
        return;
    }
    let value = 6;
    if (bardLevel >= 5 && bardLevel < 10) value = 8;
    else if (bardLevel >= 10 && bardLevel < 15) value = 10;
    else if (bardLevel >= 15) value = 12;
    let scaleFormula = `1d${value}`;
    let scaleDie = `d${value}`;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} BI`, object: token })
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You were bestowed with Bardic Inspiration.</p>
            <p>Once within the next 10 minutes you can roll the die and add the number rolled to one ability check, attack roll, or saving throw.</p>
            <p>You can wait until after you roll the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails</p>
            <p>Once the Bardic Inspiration die is rolled, it is lost.</p>
            <p>You can have only one Bardic Inspiration die at a time.</p>
            <p>Die Size: <b>${scaleFormula}</b></p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.bardicInspiration.attack,preCheckHits',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.label',
                'mode': 5,
                'value': 'Bardic Inspiration',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.save.all',
                'mode': 5,
                'value': scaleFormula,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'bardicInspiration': scaleFormula
                }
            }
        }
    };
    let moteOfPotentialeOfPotential = mba.getItem(workflow.actor, 'Mote of Potential');
    if (moteOfPotentialeOfPotential) {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.check.all',
                'mode': 5,
                'value': `2${scaleDie}kh`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.skill.all',
                'mode': 5,
                'value': `2${scaleDie}kh`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.macroToCall',
                'mode': 5,
                'value': 'function.mbaPremades.macros.moteOfPotential',
                'priority': 20
            }
        );
        setProperty(effectData, 'flags.mba-premades.feature.moteOfPotential', mba.getSpellDC(workflow.item));
    } else {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.check.all',
                'mode': 5,
                'value': scaleFormula,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.optional.bardicInspiration.skill.all',
                'mode': 5,
                'value': scaleFormula,
                'priority': 20
            }
        );
    }
    let magicalInspiration = mba.getItem(workflow.actor, 'Magical Inspiration');
    if (magicalInspiration) {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.bardicInspiration.damage,preDamageApplication',
                'priority': 20
            }

        );
    }
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.markers.music.pink")
        .attachTo(workflow.token)
        .scaleToObject(1.2)
        .fadeIn(1000)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 120 })
        .waitUntilFinished(-4000)

        .effect()
        .file("jb2a.bardic_inspiration.pink")
        .attachTo(target)
        .scaleToObject(1.6)
        .filter("ColorMatrix", { hue: 120 })
        .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-lively-1.mp3")

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.music_note.purple.03")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.85)
        .delay(500)
        .fadeIn(1000)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 130 })
        .playbackRate(0.85)
        .persist()
        .name(`${target.document.name} BI`)

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size || workflow.isFumble) return;
    let effect = await mba.findEffect(workflow.actor, "Bardic Inspiration");
    if (!effect) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'bardicInspiration', 150);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog(effect.name, constants.yesNo, `Use ${effect.name}? (Attack Total: <b>${workflow.attackTotal}</b>)`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let bardDice = effect.flags['mba-premades'].feature.bardicInspiration;
    await mba.removeEffect(effect);
    let updatedRoll = await mba.addToRoll(workflow.attackRoll, bardDice);
    workflow.setAttackRoll(updatedRoll);
    let moteOfPotential = effect.flags['mba-premades'].feature.moteOfPotential;
    if (moteOfPotential) {
        let bardDie = updatedRoll.terms[updatedRoll.terms.length - 1].total;
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Mote of Potential: Attack', false);
        if (!featureData) {
            queue.remove(workflow.item.uuid);
            return;
        }
        featureData.system.save.dc = moteOfPotential;
        featureData.system.damage.parts = [[bardDie + '[thunder]', 'thunder']];
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let newTargets = await mba.findNearby(workflow.targets.first(), 5, 'ally', false, true).map(i => i.document.uuid);
        let [config, options] = constants.syntheticItemWorkflowOptions(newTargets);
        await warpgate.wait(100);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    queue.remove(workflow.item.uuid);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size || workflow.item.type != 'spell') return;
    if ((workflow.item.system.actionType === 'rsak' || workflow.item.system.actionType === 'msak') && !workflow.hitTargets.size) return;
    let effect = await mba.findEffect(workflow.actor, "Bardic Inspiration");
    if (!effect) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'bardicInspiration', 150);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectTarget('Use Magical Inspiration?', constants.yesNoButton, workflow.targets, false, 'one');
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let bardDice = effect.flags['mba-premades'].feature.bardicInspiration;
    await mba.removeEffect(effect);
    let targetTokenID = selection.inputs.find(i => i);
    if (!targetTokenID) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let targetDamage = workflow.damageList.find(i => i.tokenId === targetTokenID);
    let defaultDamageType = workflow.defaultDamageType;
    let roll = await new Roll(bardDice + '[' + defaultDamageType + ']').roll({ 'async': true });
    roll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Magical Inspiration'
    });
    let targetActor = canvas.scene.tokens.get(targetDamage.tokenId).actor;
    if (!targetActor) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let hasDI = mba.checkTrait(targetActor, 'di', defaultDamageType);
    if (hasDI) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageTotal = roll.total;
    let hasDR = mba.checkTrait(targetActor, 'dr', defaultDamageType);
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    targetDamage.damageDetail[0].push(
        {
            'damage': damageTotal,
            'type': defaultDamageType
        }
    );
    targetDamage.totalDamage += damageTotal;
    if (defaultDamageType === 'healing') {
        targetDamage.newHP += roll.total;
        targetDamage.hpDamage -= damageTotal;
        targetDamage.appliedDamage -= damageTotal;
    } else {
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
    }
    queue.remove(workflow.item.uuid);
}

export let bardicInspiration = {
    'item': item,
    'attack': attack,
    'damage': damage
}