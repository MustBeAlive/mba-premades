export async function shield({speaker, actor, token, character, item, args, scope, workflow}) {
    // flags.midi-qol.onUseMacroName || custom || ItemMacro,preTargetDamageApplication
    if (args[0].tag!== "TargetOnUse") return;
    if (!workflow.item.name.includes("Magic Missile Bolt")) return;
    workflow.damageItem.hpDamage = 0;
}