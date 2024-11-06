import {mba} from "../../../../helperFunctions.js";

export async function spellRefuelingRing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ringItem = mba.getItem(workflow.actor, "Spell-Refueling Ring");
    if (!ringItem) {
        ui.notifications.warn("Unable to find item! (Spell-Refueling Ring)");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    if (!ringItem.system.equipped) {
        ui.notifications.warn("Spell-Refueling Ring must be equipped!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    if (ringItem.system.attunement != 2) {
        ui.notifications.warn("Spell-Refueling Ring requires attunement!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    if (ringItem.system.uses.value < 1) {
        ui.notifications.warn("Spell-Refueling Ring is out of charges!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let path;
    let pact = workflow.actor.system.spells.pact.max;
    if (pact > 0) {
        let current = workflow.actor.system.spells.pact.value;
        let max = workflow.actor.system.spells.pact.max;
        let pactLevel = workflow.actor.system.spells.pact.level;
        path = `system.spells.pact.value`;
        if (current === max) {
            ui.notifications.warn(`You don't have any spent Level ${pactLevel} slots!`);
            await game.messages.get(workflow.itemCardId).delete();
            return;
        }
        if (pactLevel > 3) {
            ui.notifications.warn(`Your spellslots are Level ${pactLevel} and can not be restored with Spell-Refueling Ring!`);
            await game.messages.get(workflow.itemCardId).delete();
            return;
        }
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
                await workflow.actor.update({ [path]: current += 1 });
                await ringItem.update({ "system.uses.value": 0 });
            })

            .play()
    }
    else {
        const slots = Array.from(Object.entries(workflow.actor.system.spells).filter(i => i[0] === "spell1" || i[0] === "spell2" || i[0] === "spell3").filter(i => i[1].value < i[1].max));
        if (!slots.length) {
            ui.notifications.info("You don't have any expended spell slots!");
            return;
        }
        let choices = [];
        for (let slot of slots) {
            let level = +slot[0].slice(5);
            if (slot[1].value < slot[1].max) choices.push([`<b>Level: ${level}</b> (Current: <b>${slot[1].value}/${slot[1].max}</b>)`, level, `modules/mba-premades/icons/generic/pearl_of_power_${level}.webp`]);
        }
        choices.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
        if (!choices.length) return;
        let slotLevel = await mba.selectImage("Spell-Refueling Ring", choices, `<b>Choose spell slot level to recover:</b>`, "value");
        if (!slotLevel) return;
        path = `system.spells.spell${slotLevel}.value`;
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
                await ringItem.update({ "system.uses.value": 0 });
            })

            .play()
    }
}