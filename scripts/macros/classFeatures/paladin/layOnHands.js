import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

export async function layOnHands({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Lay on Hands");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Lay on Hands)");
        return;
    }
    let uses = feature.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("Your Lay on Hands pool is empty!");
        return;
    }
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) === "undead" || mba.raceOrType(target.actor) === "construct") {
        ui.notifications.warn("Lay on Hands fails!");
        return;
    }
    let choicesType = [["Restore Hitpoints", "heal", "modules/mba-premades/icons/class/paladin/lay_on_hands_heal.webp"]];
    if (uses >= 5) choicesType.push(["Remove Poison/Disease", "poisonDisease", "modules/mba-premades/icons/class/paladin/lay_on_hands_cure.webp"]);
    choicesType.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
    let selectionType = await mba.selectImage("Lay on Hands", choicesType, `What would you like to do to <u>${target.document.name}</u>?<br>Lay on Hands Pool: ${uses}`, "value");
    if (!selectionType) return;
    if (selectionType === "heal") {
        let inputs = [
            {
                'label': `Restore Hitpoints (Max Available: ${uses})`,
                'type': 'number'
            }
        ];
        let selectionHeal = await mba.menu("Lay on Hands: Restore Hitpoints", constants.okCancel, inputs, true);
        if (!selectionHeal.buttons) return;
        let healAmmount = selectionHeal.inputs[0];
        if (healAmmount > uses) {
            ui.notifications.warn("Input is higher than remaining Healing Pool!");
            return;
        }
        let healingRoll = await mba.damageRoll(workflow, `${healAmmount}[healing]`);
        new Sequence()

            .effect()
            .file("jb2a.divine_smite.caster.yellowwhite")
            .attachTo(workflow.token)
            .scaleToObject(2)
            .waitUntilFinished(-1800)

            .effect()
            .file("jb2a.healing_generic.03.burst.green")
            .attachTo(target)
            .scaleToObject(2)
            .filter("ColorMatrix", { hue: 250 })
            .waitUntilFinished(-1233)

            .effect()
            .file("jb2a.healing_generic.burst.yellowwhite")
            .attachTo(target)
            .scaleToObject(1.35)
            .playbackRate(0.9)

            .thenDo(async () => {
                await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
                await feature.update({ "system.uses.value": uses -= healAmmount });
            })

            .play()
    }
    else if (selectionType === "poisonDisease") {
        let choicesType2 = [["Cure Disease", "disease"], ["Neutralize Poison", "poison"], ["Cancel", false]];
        let selectionType2 = await mba.dialog("Lay on Hands", choicesType2, "<b>What would you like to do?</b>");
        if (!selectionType2) return;
        if (selectionType2 === "disease") {
            let diseases = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true).filter(e => e.flags['mba-premades']?.lesserRestoration === true);
            if (!diseases.length) {
                ui.notifications.info("Target is not diseased!");
                return;
            }
            let choicesDiseases = [];
            for (let i of diseases) {
                let name = i.flags['mba-premades'].name;
                let value = i.name;
                choicesDiseases.push([`${name}`, `${value}`, "modules/mba-premades/icons/conditions/nauseated.webp"]);
            }
            choicesDiseases.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
            let selectionDisease = await mba.selectImage("Lay on Hands: Disease", choicesDiseases, "<b>Choose disease to cure:</b>", "value");
            if (!selectionDisease) return;
            let effectToRemove = await mba.findEffect(target.actor, selectionDisease);
            if (effectToRemove) {
                new Sequence()

                    .effect()
                    .file("jb2a.divine_smite.caster.yellowwhite")
                    .attachTo(workflow.token)
                    .scaleToObject(2)
                    .waitUntilFinished(-1800)

                    .effect()
                    .file("jb2a.healing_generic.03.burst.green")
                    .attachTo(target)
                    .scaleToObject(2)
                    .filter("ColorMatrix", { hue: 250 })
                    .waitUntilFinished(-1233)

                    .effect()
                    .file("jb2a.healing_generic.burst.yellowwhite")
                    .attachTo(target)
                    .scaleToObject(1.35)
                    .playbackRate(0.9)

                    .thenDo(async () => {
                        await feature.update({ "system.uses.value": uses -= 5 });
                        await mba.removeEffect(effectToRemove);
                    })

                    .play()
            }
        }
        else if (selectionType2 === "poison") {
            let effectsFirst = target.actor.effects.filter(i => i.name.includes("Poison"));
            if (!effectsFirst.length) {
                ui.notifications.info("Target is not poisoned!");
                return;
            }
            let effectToRemove;
            if (effectsFirst.length < 2) {
                effectToRemove = await mba.findEffect(target.actor, effectsFirst[0].name);
                if (!effectToRemove) {
                    ui.notifications.warn(`Unable to find Poison: ${effectsFirst[0].name}`);
                    return;
                }
            } else {
                let effects = effectsFirst.filter(i => i.name != "Poisoned");
                if (effects.length < 2) {
                    effectToRemove = await mba.findEffect(target.actor, effects[0].name);
                    if (!effectToRemove) {
                        ui.notifications.warn(`Unable to find Poison: ${effects[0].name}`);
                        return;
                    }
                } else {
                    effectToRemove = await mba.selectEffect("Lay on Hands: Poison", effects, "<b>Choose one effect:</b>", false);
                    if (!effectToRemove) return;
                }
            }
            if (effectToRemove) {
                new Sequence()

                    .effect()
                    .file("jb2a.divine_smite.caster.yellowwhite")
                    .attachTo(workflow.token)
                    .scaleToObject(2)
                    .waitUntilFinished(-1800)

                    .effect()
                    .file("jb2a.healing_generic.03.burst.green")
                    .attachTo(target)
                    .scaleToObject(2)
                    .filter("ColorMatrix", { hue: 250 })
                    .waitUntilFinished(-1233)

                    .effect()
                    .file("jb2a.healing_generic.burst.yellowwhite")
                    .attachTo(target)
                    .scaleToObject(1.35)
                    .playbackRate(0.9)

                    .thenDo(async () => {
                        await feature.update({ "system.uses.value": uses -= 5 });
                        await mba.removeEffect(effectToRemove);
                    })

                    .play()
            }
        }
    }
}