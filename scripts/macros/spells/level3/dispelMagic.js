import {mba} from "../../../helperFunctions.js";

export async function dispelMagic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choicesType = [["Effect on a Creature", "creature"], ["Object or other Magical Effect (such as AoE)", "object"]];
    let type = await mba.dialog("Dispel Magic", choicesType, "<b>What would you like to dispel?</b>");
    if (!type) return;
    if (type === "object") {
        let choicesGM = [
            [`Effect is dispelled (effect level <= ${workflow.castData.castLevel})`, `dispel`],
            [`Caster needs to roll (effect level > ${workflow.castData.castLevel})`, `roll`],
            [`Effect cannot be dispelled`, `unable`]
        ];
        await mba.gmDialogMessage();
        let selectionGM = await mba.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `
            <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dispel Magic</b> at <b>Level ${workflow.castData.castLevel}</b></p>
        `);
        await mba.clearGMDialogMessage();
        if (!selectionGM) return;
        if (selectionGM === "dispel") {
            ChatMessage.create({
                content: `<p>Effect is dispelled!</p>`,
                speaker: { actor: null, alias: "GM Helper" }
            });
            return;
        }
        else if (selectionGM === "roll") {
            await mba.rollRequest(workflow.token, 'abil', workflow.actor.system.attributes.spellcasting);
            return;
        }
        else if (selectionGM === "unable") {
            ChatMessage.create({
                content: `<p>Effect cannot be dispelled!</p>`,
                speaker: { actor: null, alias: "GM Helper" }
            });
            return;
        }
    }
    else if (type === "creature") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifications.warn("No target selected!");
            return;
        }
        let dispelLevel = workflow.castData.castLevel;
        let effects = target.actor.effects.filter(e => e.active === true && e.flags['midi-qol']?.castData?.castLevel >= 0);
        if (!effects.length) {
            ui.notifications.warn('No effects to dispel!');
            return;
        }
        const effectToDispel = await mba.selectEffect("Dispel Magic: Target", effects, "<b>Choose one effect:</b>");
        if (!effectToDispel) return;
        let effectLevel = effectToDispel.flags['midi-qol']?.castData?.castLevel;
        if (dispelLevel >= effectLevel) {
            new Sequence()

                .effect()
                .file("jb2a.detect_magic.circle.grey")
                .atLocation(target)
                .scaleToObject(1.5)
                .anchor(0.5)
                .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-buff-short-8.mp3")

                .wait(150)

                .thenDo(async () => {
                    await mba.removeEffect(effectToDispel);
                    ui.notifications.info(`Successfully dispelled ${effectToDispel.name}!`);
                    ChatMessage.create({
                        content: `<p>Successfully dispelled <b>${effectToDispel.name}</b>!</p>`,
                        speaker: { actor: workflow.actor }
                    });
                })

                .play();
        }
        else {
            let dispelDC = 10 + effectLevel;
            let ability = workflow.actor.system.attributes.spellcasting;
            let saveRoll = await mba.rollRequest(workflow.token, 'abil', ability);
            if (saveRoll.total >= dispelDC) {
                new Sequence()

                    .effect()
                    .file("jb2a.detect_magic.circle.grey")
                    .atLocation(target)
                    .scaleToObject(1.5)
                    .anchor(0.5)
                    .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-buff-short-8.mp3")

                    .wait(150)

                    .thenDo(async () => {
                        await mba.removeEffect(effectToDispel);
                        ui.notifications.info(`Successfully dispelled ${effectToDispel.name}!`);
                        ChatMessage.create({
                            content: `<p>Successfully dispelled <b>${effectToDispel.name}!</b>!</p>`,
                            speaker: { actor: workflow.actor }
                        });
                    })

                    .play();
            }
            else {
                ui.notifications.info(`Unfortunately, you were unable to dispel ${effectToDispel.name}`);
                ChatMessage.create({
                    content: `<p>Failed dispell check for <b>${effectToDispel.name}</b>!</p>`,
                    speaker: { actor: workflow.actor }
                });
                return;
            }
        }
    }
}