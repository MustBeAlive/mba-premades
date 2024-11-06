import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function chromaticOrb({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (workflow.hitTargets.size != 1) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.ranged.03.projectile.01.yellow")
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })

            .play()

        return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'chromaticOrb', 50);
    if (!queueSetup) return;
    let choices = [
        ['Acid', 'acid', "modules/mba-premades/icons/spells/level1/chromatic_orb_acid.webp"],
        ['Cold', 'cold', "modules/mba-premades/icons/spells/level1/chromatic_orb_cold.webp"],
        ['Fire', 'fire', "modules/mba-premades/icons/spells/level1/chromatic_orb_fire.webp"],
        ['Lightning', 'lightning', "modules/mba-premades/icons/spells/level1/chromatic_orb_lightning.webp"],
        ['Poison', 'poison', "modules/mba-premades/icons/spells/level1/chromatic_orb_poison.webp"],
        ['Thunder', 'thunder', "modules/mba-premades/icons/spells/level1/chromatic_orb_thunder.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage('Chromatic Orb', choices, `<b>Choose damage type:</b>`, "both");
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageFormula = workflow.damageRoll._formula.replace('none', selection[0]);
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
    let animation1;
    let animation2;
    let hue1;
    switch (selection[0]) {
        case 'acid':
            animation1 = "jb2a.ranged.03.projectile.01.yellow";
            animation2 = "jb2a.impact.003.green";
            hue1 = 70;
            break;
        case 'cold':
            animation1 = "jb2a.ranged.03.projectile.01.yellow";
            animation2 = "jb2a.impact.003.blue";
            hue1 = 130;
            break;
        case 'fire':
            animation1 = "jb2a.ranged.03.projectile.01.yellow";
            animation2 = "jb2a.impact.003.dark_red";
            hue1 = 320;
            break;
        case 'lightning':
            animation1 = "jb2a.ranged.03.projectile.01.yellow";
            animation2 = "jb2a.impact.003.blue";
            hue1 = 170;
            break;
        case 'poison':
            animation1 = "jb2a.ranged.03.projectile.01.yellow";
            animation2 = "jb2a.impact.003.green";
            hue1 = 40;
            break;
        case 'thunder':
            animation1 = "jb2a.ranged.03.projectile.01.pinkpurple";
            animation2 = "jb2a.impact.003.pinkpurple";
            hue1 = 0;
            break;
    }

    new Sequence()

        .effect()
        .file(animation1)
        .attachTo(workflow.token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: hue1 })
        .waitUntilFinished(-900)

        .effect()
        .file(animation2)
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .playbackRate(0.8)

        .play();
}