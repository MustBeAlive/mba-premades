async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let level = workflow.castData.castLevel;
    let targets = Array.from(workflow.targets);
    let healAmmount = (5 * (level - 1));
    for (i of targets) {
        await chrisPremades.helpers.applyDamage([i], healAmmount, 'healing');
    }
}

async function del(actor) {
    let maxHP = actor.system.attributes.hp.max;
    let currentHP = actor.system.attributes.hp.value;
    if (currentHP > maxHP) {
        await actor.update({ "system.attributes.hp.value": maxHP })
    }
}

export let aid = {
    'item': item,
    'del': del
}