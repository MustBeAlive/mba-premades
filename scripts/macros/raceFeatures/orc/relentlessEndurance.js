export async function relentlessEndurance(token, {item, workflow, ditem}) {
    if (ditem.newHP != 0 || ditem.oldHP === 0) return;
    let tokenActor = token.actor;
    let effect = chrisPremades.helpers.findEffect(tokenActor, 'Relentless Endurance');
    if (!effect) return;
    let maxHP = tokenActor.system.attributes?.hp?.max;
    if (!maxHP) return;
    if (ditem.appliedDamage > (maxHP + ditem.oldHP)) return;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    if (originItem.system.uses.value === 0) return;
    let selection = await chrisPremades.helpers.remoteDialog(originItem.name, [['Yes', true], ['No', false]], chrisPremades.helpers.firstOwner(token.document).id, 'Use Relentless Endurance?');
    if (!selection) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.uuid, 'relentlessEndurance', 389);
    if (!queueSetup) return;
    await originItem.update({
        'system.uses.value': originItem.system.uses.value - 1
    });
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    chrisPremades.queue.remove(workflow.uuid);
}