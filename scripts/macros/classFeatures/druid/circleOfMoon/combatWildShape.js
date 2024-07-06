import {mba} from "../../../../helperFunctions.js";

export async function combatWildShape({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.actor, "Wild Shape")) {
        ui.notifications.info("You can only heal while Wild Shape is active!");
        return;
    }
    let choices = [];
    for (let i of Object.entries(workflow.actor.system.spells)) {
        let level = +i[0].slice(5);
        if (i[1].value > 0) choices.push([`<b>Level: ${level} (${level}d8)</b> (Current: <b>${i[1].value}/${i[1].max}</b>)`, level, `modules/mba-premades/icons/class/sorcerer/spell_slot_restoration_level_${level}.webp`]);
    }
    let slotLevel = await mba.selectImage("Combat Wild Shape", choices, `Choose spell level:`, "value");
    if (!slotLevel) return;
    let path = `system.spells.spell${slotLevel}.value`;
    let newValue = foundry.utils.getProperty(workflow.actor, path) - 1;
    if (isNaN(newValue)) {
        ui.notifications.warn("Unable to find spell level path!");
        Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Arcane Recovery`, 'object': workflow.token });
        return;
    }
    let healingRoll = await new Roll(`${slotLevel}d8[healing]`).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(workflow.token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(workflow.token)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            await workflow.actor.update({ [path]: newValue });
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], undefined, workflow.itemCardId);
        })

        .play()
}