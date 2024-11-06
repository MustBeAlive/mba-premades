import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do: rewrite as synthetic item OR find how to change save ability midroll

export async function deleriumOrb({ speaker, actor, token, character, item, args, scope, workflow }) {
    console.log(workflow);
    let queueSetup = await queue.setup(workflow.item.uuid, 'deleriumOrb', 50);
    if (!queueSetup) return;
    let choicesAbility = [
        ['Strength', 'str'],
        ['Dexterity', 'dex'],
        ['Constitution', 'con'],
        ['Intelligence', 'int'],
        ['Wisdom', 'wis'],
        ['Charisma', 'cha']
    ];
    await mba.playerDialogMessage(game.user);
    let selectionAbility = await mba.dialog("Delerium Orb: Ability", choicesAbility, `<b>Choose save ability:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selectionAbility) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let choicesElement = [
        ['Cold', 'cold', "modules/mba-premades/icons/generic/generic_cold.webp"],
        ['Fire', 'fire', "modules/mba-premades/icons/generic/generic_fire.webp"],
        ['Lightning', 'lightning', "modules/mba-premades/icons/generic/generic_lightning.webp"],
        ['Necrotic', 'necrotic', "modules/mba-premades/icons/generic/generic_necrotic.webp"],
        ['Psychic', 'psychic', "modules/mba-premades/icons/generic/generic_psychic.webp"],
        ['Radiant', 'radiant', "modules/mba-premades/icons/generic/generic_radiant.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selectionElement = await mba.selectImage('Delerium Orb: Element', choicesElement, `<b>Choose damage type:</b>`, "value");
    await mba.clearPlayerDialogMessage();
    if (!selectionElement) {
        queue.remove(workflow.item.uuid);
        return;
    }
    workflow.item.system.save.ability = selectionAbility;
    let damageFormula = workflow.damageRoll._formula.replace('none', selectionElement);
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
    await contamination.addContamination(workflow.token);
}