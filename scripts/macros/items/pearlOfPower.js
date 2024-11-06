import {mba} from "../../helperFunctions.js";

// To do: pact slots

export async function pearlOfPower({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pearlItem = mba.getItem(workflow.actor, "Pearl of Power");
    if (!pearlItem) {
        ui.notifications.warn("Unable to find item! (Pearl of Power)");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    if (pearlItem.system.attunement != 2) {
        ui.notifications.warn("Pearl of Power requires attunement!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    if (pearlItem.system.uses.value < 1) {
        ui.notifications.warn("Pearl of Power is out of charges!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    const slots = Array.from(Object.entries(workflow.actor.system.spells).filter(i => i[0] === "spell1" || i[0] === "spell2" || i[0] === "spell3").filter(i => i[1].value < i[1].max));
    if (!slots.length) {
        ui.notifications.info("You don't have any expended spell slots!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let choices = [];
    for (let slot of slots) {
        let level = +slot[0].slice(5);
        if (slot[1].value < slot[1].max) choices.push([`<b>Level: ${level}</b> (Current: <b>${slot[1].value}/${slot[1].max}</b>)`, level, `modules/mba-premades/icons/generic/pearl_of_power_${level}.webp`]);
    }
    choices.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
    if (!choices.length) return;
    let slotLevel = await mba.selectImage("Pearl of Power", choices, `<b>Choose spell slot level to recover:</b>`, "value");
    if (!slotLevel) return;
    let path = `system.spells.spell${slotLevel}.value`;
    let newValue = foundry.utils.getProperty(workflow.actor, path) + 1;
    if (isNaN(newValue)) return;
    new Sequence()

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.5 * workflow.token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { hue: 150 })

        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .delay(2000)
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: 330 })
        .playbackRate(0.9)

        .wait(3000)

        .thenDo(async () => {
            await workflow.actor.update({ [path]: newValue });
            await pearlItem.update({ "system.uses.value": 0 });
        })

        .play()
}