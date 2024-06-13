import {mba} from "../../../helperFunctions.js";

export async function command({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    const target = workflow.targets.first();
    let choices = [
        ['Approach', 'Appro'],
        ['Drop', 'Drop'],
        ['Flee', 'Flee'],
        ['Grovel', 'Grovel'],
        ['Halt', 'Halt'],
        ['Other', 'Other']
    ];
    let selection = await mba.dialog("Command", choices, `<b>Choose command word:</b>`);
    if (!selection) return;
    let name;
    let icon;
    let description;
    let word = [];
    const style = {
        "fill": "#ffffff",
        "fontFamily": "Helvetica",
        "fontSize": 40,
        "strokeThickness": 0,
        fontWeight: "bold",
    }
    if (selection === "Appro") {
        name = "Command: Approach";
        icon = "modules/mba-premades/icons/spells/level1/command_approach.webp";
        description = "You willingly move to the caster of Command spell by the shortest and most direct route, ending your if you come within 5 feet of the caster.";
        word.push("Approach!");
    }
    else if (selection === "Drop") {
        name = "Command: Drop";
        icon = "modules/mba-premades/icons/spells/level1/command_drop.webp";
        description = "You willingly drop whatever you are holding and then end your turn.";
        word.push("Drop!");
    }
    else if (selection === "Flee") {
        name = "Command: Flee";
        icon = "modules/mba-premades/icons/spells/level1/command_flee.webp";
        description = "You spend your turn moving away from caster by the fastest available means.";
        word.push("Flee!");
    }
    else if (selection === "Grovel") {
        name = "Command: Grovel";
        icon = "modules/mba-premades/icons/spells/level1/command_grovel.webp";
        description = "You fall prone and then end your turn.";
        word.push("Grovel!");
    }
    else if (selection === "Halt") {
        name = "Command: Halt";
        icon = "modules/mba-premades/icons/spells/level1/command_halt.webp";
        description = "You don't move and take no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.";
        word.push("Halt!");
    }
    else if (selection === "Other") {
        name = "Command";
        icon = "modules/mba-premades/icons/spells/level1/command_halt.webp";
        description = "You follow the custom Command";
        word.push("&%@#!");
    }
    let effectData = {
        'name': name,
        'icon': icon,
        'description': description,
        'duration': {
            'rounds': 1
        },
        'flags': {
            'dae': {
                'specialDuration': ['turnEnd']
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    }

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.healing word.green")
        .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .zIndex(1)
        .scale(0.25 * target.data.width)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .filter("ColorMatrix", { hue: 200 })

        .effect()
        .file("jb2a.particles.outward.purple.02.04")
        .atLocation(target, { offset: { x: 0, y: -0.55 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .zIndex(1)
        .scale(0.25 * target.data.width)
        .duration(600)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .zIndex(0)

        .effect()
        .file("jb2a.particles.outward.purple.02.03")
        .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
        .fadeOut(250)
        .scale(0.25 * target.data.width)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 1000, gridUnits: true, delay: 500 })
        .animateProperty("sprite", "scale.x", { from: 0, to: 0.15, duration: 1000, delay: 500 })
        .animateProperty("sprite", "scale.y", { from: 0, to: 0.15, duration: 1000, delay: 500 })
        .zIndex(1.1)

        .effect()
        .text(`${word}`, style)
        .atLocation(target, { offset: { x: 0, y: -0.6 * target.data.width }, gridUnits: true })
        .duration(2500)
        .fadeOut(1000)
        .animateProperty("sprite", "position.y", { from: 0, to: 0.6 * target.data.width, duration: 2500, gridUnits: true, delay: 500 })
        .animateProperty("sprite", "scale.x", { from: 0, to: -0.5, duration: 1000, delay: 500 })
        .animateProperty("sprite", "scale.y", { from: 0, to: -0.5, duration: 1000, delay: 500 })
        .rotateIn(-10, 1000, { ease: "easeOutElastic" })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .filter("Glow", { color: 0xab01b7 })
        .zIndex(1)
        .waitUntilFinished(-1000)

        .effect()
        .from(target)
        .opacity(0.5)
        .attachTo(target)
        .duration(1000)
        .fadeIn(500)
        .fadeOut(500, { ease: "easeInSine" })
        .scaleToObject(target.document.texture.scaleX)
        .filter("Glow", { color: 0xab01b7, distance: 20 })
        .filter("ColorMatrix", { brightness: 1.5 })
        .tint(0xab01b7)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            if (selection === "Grovel") await mba.addCondition(target.actor, "Prone");
        })

        .play()
}