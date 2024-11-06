import {mba} from "../../../helperFunctions.js";

export async function incorporealMovement(token) {
    let inside = await mba.findNearby(token, 1, "any", false, false);
    if (!inside.length) return;
    let damageRoll = await new Roll("1d10[force]").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll);
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { alias: name },
        flavor: `${token.document.name}: Incorporeal Movement`
    });
    await mba.applyDamage([token], damageRoll.total, "force");
}