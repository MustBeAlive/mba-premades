import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

async function contaminationHitDie(actor, config, denom) {
    let effects = actor.effects.filter(e => e.name === "Contamination 2" || e.name === "Contamination 3" || e.name === "Contamination 4" || e.name === "Contamination 5" || e.name === "Contamination 6");
    if (!effects.length) return;
    config.formula = `max(0, ceil((1${denom} + @abilities.con.mod)/2))`;
    return;
}

async function contaminationPreLongRest(actor) {
    let [contEffect] = actor.effects.filter(e => e.name === "Contamination 3" || e.name === "Contamination 4" || e.name === "Contamination 5" || e.name === "Contamination 6");
    if (!contEffect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'longRest': actor.system.attributes.hp.value
            }
        }
    };
    await mba.updateEffect(contEffect, updates);
}

async function contaminationAfterLongRest(actor) {
    let [contEffect] = actor.effects.filter(e => e.name === "Contamination 3" || e.name === "Contamination 4" || e.name === "Contamination 5" || e.name === "Contamination 6");
    if (!contEffect) return;
    console.log(contEffect);
    let value = contEffect.flags['mba-premades']?.longRest;
    await actor.update({ "system.attributes.hp.value": value });
}

async function contaminationHalfDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'contaminationHalfDamage', 399);
    if (!queueSetup) return;
    if (workflow.damageRoll) await workflow.setDamageRoll(await new Roll(`floor((${workflow.damageRoll.formula})/2)`).evaluate());
    if (workflow.otherDamageRoll) await workflow.setOtherDamageRoll(await new Roll(`floor((${workflow.otherDamageRoll.formula})/2)`).evaluate());
    if (workflow.bonusDamageRoll) await workflow.setBonusDamageRoll(await new Roll(`floor((${workflow.bonusDamageRoll.formula})/2)`).evaluate());
    queue.remove(workflow.item.uuid);
}

async function addContamination(target) {
    let immune = await mba.findEffect(target.actor, "Fully Contaminated");
    if (immune) return;
    let contamination = target.actor.effects.find(e => e.name.toLowerCase().includes("Contamination".toLowerCase()));
    if (!contamination) {
        await mba.addCondition(target.actor, `Contamination 1`);
        await ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>Target Name: <u>${target.document.name}</u></p>
                <p>Each time a character gains a contamination level, it rolls 1d6.</p>
                <p>If the result is equal to or less than the character's current contamination level <b><u>(1)</u></b>, the creature gains a Mutation.</p>
            `,
            speaker: { alias: "MBA Premades: Delerium Contamination" }
        });
        return;
    }
    let level = +contamination.name.slice(-1);
    if (level === 6) return;
    await mba.removeCondition(target.actor, `Contamination ${level}`);
    await mba.addCondition(target.actor, `Contamination ${level + 1}`);
    level += 1;
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `
            <p>Name: <u>${target.document.name}</u></p>
            <p>Each time a character gains a contamination level, it rolls 1d6.</p>
            <p>If the result is equal to or less than the character's current contamination level <b><u>(${level})</u></b>, the creature gains a Mutation.</p>
        `,
        speaker: { alias: "MBA Premades: Delerium Contamination" }
    });
}
 
export let contamination = {
    'contaminationHitDie': contaminationHitDie,
    'contaminationPreLongRest': contaminationPreLongRest,
    'contaminationAfterLongRest': contaminationAfterLongRest,
    'contaminationHalfDamage': contaminationHalfDamage,
    'addContamination': addContamination,
}