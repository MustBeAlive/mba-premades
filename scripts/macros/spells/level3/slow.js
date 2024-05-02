async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = 6;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroStart() {
        await new Dialog({
            title: "Slow",
            content: `
                <p>You are slowed. You <b>can't use reactions</b>. On your turn, you can use either an <b>Action or a Bonus Action, not both</b>. Regardless of your abilities or magic items, you <b>can't make more than one melee or ranged attack during your turn.</b></p>
                <p>If you attempt to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until your next turn, and you <b>must use your Action on that turn to complete the spell</b>. If you can't, the spell is wasted.</p>
                <p>You can make another Wisdom Saving Throw at the end of each of your turns. On a successful save, the effect ends.</p>
            `,
            buttons: { ok: { label: "Ok!" } }
        }).render(true);
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are slowed. You <b>can't use reactions</b>. On your turn, you can use either an <b>Action or a Bonus Action, not both</b>. Regardless of your abilities or magic items, you <b>can't make more than one melee or ranged attack during your turn.</b></p>
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
                'priority': 20
            },
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': "-2",
                'priority': 20
            },
            {
                'key': 'system.abilities.dex.bonuses.save',
                'mode': 2,
                'value': "-2",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Slow End Turn',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacroStart)
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
    for (let target of targets) await chrisPremades.helpers.createEffect(target.actor, effectData);
}

async function reaction({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.system.activation.type.includes('reaction')) return;
    ui.notifications.warn("You are affected by Slow spell and can't use reactions!");
    return false;
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (chrisPremades.helpers.findEffect(actor, 'Slow: Postponed Spell')) return;
    if (workflow.item.type != "spell" && workflow.item.system.activation.type != "action") return;
    let slowRoll = await new Roll('1d20').roll({ 'async': true }); // it would've been much better if it requested the roll from the player (don't want to use Monk's TokenBar)
    await MidiQOL.displayDSNForRoll(slowRoll, 'damageRoll');
    slowRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Slow: Spell Failure Check'
    });
    if (slowRoll.total < 11) return;
    await new Dialog({
        title: "Slow: Postponed Spell",
        content: `
                <p>Spell you are casting won't take effect until your next turn.</p>
                <p>Moreover, you <b>must use your Action on that turn</b> to complete the spell.</p>
                <p>If you are unable to do that, the spell is wasted.</p>
            `,
        buttons: { ok: { label: "Ok!" } }
    }).render(true);
    let effectData = {
        'name': `Slow: Postponed Spell`,
        'icon': workflow.item.img,
        'description': `
            <p>Spell you are casting won't take effect until your next turn.</p>
            <p>Moreover, you <b>must use your Action on that turn</b> to complete the spell.</p>
            <p>If you are unable to do that, the spell is wasted.</p>
            <p></p>
            <p>Postponed spell: ${workflow.item.name}</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["1Spell", "turnEnd"]
            }
        },
    };
    await chrisPremades.helpers.createEffect(actor, effectData);
    return false;

}

export let slow = {
    'cast': cast,
    'item': item,
    'reaction': reaction,
    'check': check
}