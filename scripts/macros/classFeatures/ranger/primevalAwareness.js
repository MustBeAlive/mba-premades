import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

export async function primevalAwareness({ speaker, actor, token, character, item, args, scope, workflow }) {
    let slots = Object.entries(workflow.actor.system.spells).filter(i => i[1].slotAvailable === true);
    if (!slots.length) {
        ui.notifications.warn("You don't have any slots available to use Primeval Awareness!");
        return;
    }
    let choices = [];
    for (let slot of slots) {
        let level = +slot[0].slice(5);
        if (slot[1].value >= 1) choices.push([`<b>Level: ${level}</b> (Current: <b>${slot[1].value}/${slot[1].max}</b>)`, level, `modules/mba-premades/icons/class/sorcerer/spell_slot_restoration_level_${level}.webp`]);
    }
    choices.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
    await mba.playerDialogMessage();
    let slotLevel = await mba.selectImage("Primeval Awareness", choices, `Choose spell slot level to use:`, "value");
    await mba.clearPlayerDialogMessage();
    if (!slotLevel) return;
    let path = `system.spells.spell${slotLevel}.value`;
    let newValue = foundry.utils.getProperty(workflow.actor, path) - 1;
    if (isNaN(newValue)) {
        ui.notifications.warn("Unable to find spell level path!");
        return;
    }
    let choicesType = [
        ["Aberrations", "aberrations"],
        ["Celestials", "celestials"],
        ["Dragons", "dragons"],
        ["Elementals", "elementals"],
        ["Fey", "fey"],
        ["Fiend", "fiend"],
        ["Undead", "undead"]
    ];
    await mba.playerDialogMessage();
    let selectionType = await mba.dialog("Primeval Awareness", choicesType, "Select creature type:");
    await mba.clearPlayerDialogMessage();
    if (!selectionType) return;
    let favoredTerrain = "1 mile";
    await mba.gmDialogMessage();
    let check = await mba.remoteDialog("Primeval Awareness: GM", constants.yesNo, game.users.activeGM.id, `Is <b>${workflow.token.document.name} in his favored terrain?</b>`);
    if (check) favoredTerrain = "6 miles";
    await mba.clearGMDialogMessage();
    let duration = 60 * slotLevel;
    let effectData = {
        'name': "Primeval Awareness",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you can sense if ${selectionType} creatures are present within ${favoredTerrain} of you.</p>
            <p>This feature doesn't reveal the creatures' location or number.</p>
        `,
        'duration': {
            'seconds': duration
        }
    };
    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.greenyellow.01.03`)
        .attachTo(workflow.token)
        .scale(0.15)
        .playbackRate(1)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .animateProperty("sprite", "width", { from: 0, to: 0.5, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.5, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -1, duration: 1000, gridUnits: true })
        .zIndex(0.2)

        .effect()
        .file("jb2a.hunters_mark.loop.02.green")
        .attachTo(workflow.token)
        .scaleToObject(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(workflow.token)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })
        .belowTokens()

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .fadeOut(3000)
        .duration(3500)
        .opacity(1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 182 })
        .scaleIn(0, 250, { ease: "easeOutCubic" })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .belowTokens()
        .tint("#098a00")
        .opacity(2)
        .scaleToObject(1.35)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)

        .thenDo(async () => {
            await workflow.actor.update({ [path]: newValue });
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}