export async function heroesFeast({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = Array.from(workflow.targets);
    let rollFormula = '2d10';
    let hpRoll = await new Roll(rollFormula).roll({async: true});
    await MidiQOL.displayDSNForRoll(hpRoll, 'damageRoll');
    hpRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: `<b>Heroes' Feast</b>`
    });
    async function effectMacroDel() {
        let maxHP = actor.system.attributes.hp.max;
        let currentHP = actor.system.attributes.hp.value;
        if (currentHP > maxHP) {
            await actor.update({ "system.attributes.hp.value": maxHP })
        }
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': 'As soon as you are affected by Heroes\' Feast, you are cured of all diseases and poisons. You also become immune to being poisoned and frightened and gain advantage on all Wisdom saving throws. For the next 24 hours, your hit point maximum is increases by 2d10, and you gain the same number of hit points.',
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "poisoned",
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "frightened",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.wis',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.attributes.hp.tempmax',
                'mode': 2,
                'value': hpRoll.total,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mbaPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        await mbaPremades.helpers.createEffect(target.actor, effectData);
        await mbaPremades.helpers.applyDamage([target], hpRoll.total, 'healing');
    }
}