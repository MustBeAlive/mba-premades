import {mba} from "../../helperFunctions.js";

export function itemDC(effect, updates, options, user) {
    if (!updates.changes || !effect.parent || !effect.origin) return;
    if (updates.changes.length === 0) return;
    if (effect.parent.constructor.name != 'Actor5e') return;
    let origin = fromUuidSync(effect.origin);
    if (!origin) return;
    if (origin.constructor.name != 'Item5e') return;
    let changed = false;
    for (let i of updates.changes) {
        if (typeof i.value !== 'string') continue;
        if (i.value.includes('$mba.itemDC')) {
            let itemDC = mba.getSpellDC(origin);
            i.value = i.value.replace('$mba.itemDC', itemDC);
            changed = true;
        }
        if (i.value.includes('$mba.itemMod')) {
            let itemMod = mba.getSpellMod(origin);
            i.value = i.value.replace('$mba.itemMod', itemMod);
            changed = true;
        }
    }
    if (!changed) return;
    effect.updateSource({'changes': updates.changes});
}

export function noEffectAnimationCreate(effect, updates,  options, userId) {
    if (effect.flags['mba-premades']?.effect?.noAnimation) options.animate = false
}

export function noEffectAnimationDelete(effect,  options, userId) {
    if (effect.flags['mba-premades']?.effect?.noAnimation) options.animate = false
}