import { mba } from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 100) {
        ui.notifications.warn('Target has more than 100 HP!');
        return;
    }
    if (mba.checkTrait(target.actor, 'ci', 'charmed')) {
        ui.notifications.warn('Target is immune to condition: Charmed!');
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by crippling pain.</p>
            <p>Any speed you have cannot be higher than 10 feet. You also have disadvantage on attack rolls, ability checks, and saving throws, other than Constitution saving throws.</p>
            <p>Finally, if you try to cast a spell, you must first succeed on a Constitution saving throw, or the casting fails and the spell is wasted.</p>
            <p>At the end of each of your turns, you can make a Constitution saving throw. On a successful save, the effect ends.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.powerWordPain.check,preItemRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=' + mba.getSpellDC(workflow.item) + ' , saveMagic=true, name=Power Word Pain: Turn End, killAnim=true',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.burrow',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.climb',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.fly',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.hover',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.swim',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 3,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.str',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.int',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.wis',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.cha',
                'mode': 2,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'mba-premades': {
                'spell': {
                    'powerWordPain': {
                        'saveDC': mba.getSpellDC(workflow.item),
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.sacred_flame.source.white")
        .atLocation(target)
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)
        .anchor(0.5)

        .effect()
        .file("jb2a.sacred_flame.target.white")
        .atLocation(target)
        .scaleToObject(2.5)
        .delay(1500)
        .fadeIn(250)
        .fadeOut(500)
        .anchor(0.5)

        .wait(3500)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play();
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != "spell" || workflow.item.name === "Power Word Pain: Turn End") return;
    let effect = await mba.findEffect(actor, "Power Word: Pain");
    let spellDC = effect.flags['mba-premades']?.spell?.powerWordPain?.saveDC;
    let saveRoll = await mba.rollRequest(token, 'save', 'con');
    if (saveRoll.total >= spellDC) return;
    else {
        ui.notifications.warn('Spell fails!');
        return false;
    }
}

export let powerWordPain = {
    'item': item,
    'check': check
}