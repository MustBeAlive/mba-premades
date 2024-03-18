async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    let ditem = workflow.damageItem;
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let targetActor = workflow.targets.first().actor;
    let maxHP = targetActor.system.attributes?.hp?.max;
    if (!maxHP) return;
    if (ditem.appliedDamage > (maxHP + ditem.oldHP)) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.uuid, 'harm', 389);
    if (!queueSetup) return;
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    chrisPremades.queue.remove(workflow.uuid);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let target = workflow.targets.first();
    let ammount = workflow.damageRoll.total;
    let effectData = {
        'name': "Harm",
        'icon': "assets/library/icons/sorted/spells/level6/harm.webp",
        'description': "Virulent disease lowered your hit point maximum.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': "system.attributes.hp.tempmax", 
                'mode': 2, 
                'value': '-' + ammount, 
                'priority': 20
            }
        ],
      };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}

export let harm = {
    'damage': damage,
    'item': item
}