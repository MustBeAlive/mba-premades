import {mba} from "../../../../helperFunctions.js";

export async function survivor(actor, token) {
    let currentHP = actor.system.attributes.hp.value;
    let maxHP = actor.system.attributes.hp.max;
    if (currentHP < 1 || currentHP > Math.min(maxHP / 2)) return;
    let formula = `5 + ${actor.system.abilities.con.mod}`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await healingRoll.toMessage({
        flavor: `<h2>Survivor</h2>`,
        speaker: ChatMessage.getSpeaker({ token: token.document })
    });
    await mba.applyDamage([token], healingRoll.total, "healing");
}