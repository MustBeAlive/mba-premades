import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = 6;
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget("Slow", constants.okCancel, Array.from(workflow.targets), false, "multiple", undefined, false, `Choose which targets to keep (Max: ${ammount})`);
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    mba.updateTargets(newTargets);
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    // To do: animation
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let concEffect = await mba.findEffect(workflow.actor, "Concentrating");
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!workflow.failedSaves.size) {
        await mba.removeEffect(concEffect);
        return;
    }
    async function effectMacroTurnStart() {
        if (!mbaPremades.helpers.findEffect(token.actor, "Reaction")) await mbaPremades.helpers.addCondition(token.actor, "Reaction");
        await mbaPremades.helpers.dialog("Slow", [["Ok!", false]], `
                <p>You are slowed.</p>
                <p>You can't use reactions.</p>
                <p>On your turn, you can use either<br>an Action or a Bonus Action, not both.</p>
                <p>Regardless of your abilities or magic items, you can't make more than one<br>melee or ranged attack during your turn.</p>
                <p>If you attempt to cast a spell with a casting time<br>of 1 action, roll a d20. On an 11 or higher,<br>the spell doesn't take effect until your next turn, and you must use your Action on that turn to complete the spell.</p>
                <p>If you can't, the spell is wasted.</p>
                <p>You can make another Wisdom Saving Throw at the end of each of your turns.</p>
                <p>On a successful save, the effect ends.</p>
            `);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Slow` });
        let reaction = await mbaPremades.helpers.findEffect(token.actor, "Reaction");
        if (reaction) await mbaPremades.helpers.removeEffect(reaction);
        let postponedSpell = await mbaPremades.helpers.findEffect(token.actor, "Slow: Postponed Spell");
        if (postponedSpell) {
            let spellName = postponedSpell.flags['mba-premades']?.spell?.slow?.postponedSpellName;
            await mbaPremades.helpers.dialog("Slow: Postponed Spell", [["Ok!", false]], `Reminder: you were attempting to cast ${spellName}`);
            await mbaPremades.helpers.removeEffect(postponedSpell);
        }
    };
    let effectData = {
        'name': "Slow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are slowed. You <b>can't use reactions</b>. On your turn, you can use either an <b>Action or a Bonus Action, not both</b>.</p>
            <p>Regardless of your abilities or magic items, you <b>can't make more than one melee or ranged attack during your turn.</b></p>
            <p>If you attempt to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until your next turn, and you <b>must use your Action on that turn to complete the spell</b>. If you can't, the spell is wasted.</p>
            <p>You can make another Wisdom Saving Throw at the end of each of your turns. On a successful save, the effect ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.slow.reaction,preItemRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.slow.check,preItemRoll',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0.5",
                'priority': 30
            },
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': "-2",
                'priority': 30
            },
            {
                'key': 'system.abilities.dex.bonuses.save',
                'mode': 2,
                'value': "-2",
                'priority': 30
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=${mbaPremades.helpers.getSpellDC(workflow.item)}, saveMagic=true, name=Slow: Turn End, killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        // To do: persistent animation
        await mba.createEffect(target.actor, effectData);
        if (!mba.findEffect(target.actor, "Reaction")) await mba.addCondition(target.actor, "Reaction");
    }
    await template.delete();
}

async function reaction({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.system.activation.type.includes('reaction')) return;
    ui.notifications.warn("You are affected by Slow spell and are unable to use reactions!");
    return false;
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.actor, "Slow: Postponed Spell")) return;
    if (workflow.item.type != "spell" || workflow.item.system.activation.type != "action") return;
    let slowRoll = await new Roll('1d20').roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(slowRoll);
    slowRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Slow: Spell Failure Check'
    });
    if (slowRoll.total < 11) return;
    await mba.dialog("Slow: Postponed Spell", [["Ok!", false]], `
            <p>Spell you are attempting to cast won't take effect until your next turn.</p>
            <p>Moreover, you <b>must use your Action on that turn</b> to complete the spell.</p>
            <p>If you are unable to do that, the spell is wasted.</p>
        `);
    let effectData = {
        'name': `Slow: Postponed Spell`,
        'icon': workflow.item.img,
        'description': `
            <p>Spell you are attempting to cast won't take effect until your next turn.</p>
            <p>Moreover, you <b>must use your Action on that turn</b> to complete the spell.</p>
            <p>If you are unable to do that, the spell is wasted.</p>
            <p></p>
            <p>Postponed spell: ${workflow.item.name}</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["1Spell", "turnEnd", "combatEnd"]
            },
            'mba-premades': {
                'spell': {
                    'slow': {
                        'postponedSpellName': workflow.item.name
                    }
                }
            }
        },
    };
    await mba.createEffect(workflow.actor, effectData);
    return false;
}

export let slow = {
    'cast': cast,
    'item': item,
    'reaction': reaction,
    'check': check
}