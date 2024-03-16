async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 100) {
        ui.notifications.warn('Target has more than 100 HP!');
        return;
    }

    let hasCharmImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
    if (hasCharmImmunity) {
        ui.notifications.warn('Target is immune to condition: Charmed!');
        return;
    }

    new Sequence()
        .effect()
        .file("jb2a.sacred_flame.source.white")
        .atLocation(target)
        .anchor(0.5)
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)

        .effect()
        .file("jb2a.sacred_flame.target.white")
        .atLocation(target)
        .scaleToObject(2.5)
        .anchor(0.5)
        .fadeIn(250)
        .fadeOut(500)
        .delay(1500)

        .play();
        await warpgate.wait(3500);

    const effectData = {
        'name': "Power Word: Pain",
        'icon': "assets/library/icons/sorted/spells/level7/power_word_pain.webp",
        'description': "You are affected by crippling pain. Any speed you have cannot be higher than 10 feet. You also have disadvantage on attack rolls, ability checks, and saving throws, other than Constitution saving throws. Finally, if you try to cast a spell, you must first succeed on a Constitution saving throw, or the casting fails and the spell is wasted. At the end of each of your turns, you can make a Constitution saving throw. On a successful save, the pain ends.",
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
                'value': 'turn=end, saveAbility=con, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Crippling Pain',
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
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                    }
                }
            },
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}

async function check({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.item.type != "spell" || workflow.item.name === "Crippling Pain") return;
    let effect = await chrisPremades.helpers.findEffect(actor, "Power Word: Pain");
    let spellDC = effect.flags['mba-premades']?.spell?.powerWordPain?.dc;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
    if (saveRoll.total < spellDC) {
        ui.notifications.warn('Spell fails!');
        return false;
    }
}

export let powerWordPain = {
    'item': item,
    'check': check
}