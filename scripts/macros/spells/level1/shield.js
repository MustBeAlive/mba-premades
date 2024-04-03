export async function shield({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.name.includes("Magic Missile Bolt")) return;
    workflow.damageItem.hpDamage = 0;
}