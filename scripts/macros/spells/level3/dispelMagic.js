export async function dispelMagic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Effect on a Creature", "creature"], ["Object or other Magical Effect (such as AoE)", "object"]];
    let type = await chrisPremades.helpers.dialog("What would you like to dispel?", choices);
    if (!type) return;
    if (type === "object") {
        let choicesGM = [
            [`Effect is dispelled (effect level <= ${workflow.castData.castLevel})`, `dispel`],
            [`Caster needs to roll (effect level > ${workflow.castData.castLevel})`, `roll`],
            [`Effect cannot be dispelled`, `unable`]
        ];
        let selectionGM = await chrisPremades.helpers.remoteDialog(workflow.item.name, choicesGM, game.users.activeGM.id, `
            <p><b>${workflow.token.document.name}</b> attempts to cast <b>Dispel Magic</b> at <b>${workflow.castData.castLevel} level</b></p>
        `);
        if (!selectionGM) return;
        if (selectionGM === "unable") {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `
                    <p>Effect cannot be dispelled!</p>
                `,
                speaker: { actor: null, alias: "GM Helper" }
            });
            return;
        }
        if (selectionGM === "roll") {
            await chrisPremades.helpers.rollRequest(workflow.token, 'abil', workflow.actor.system.attributes.spellcasting);
            return;
        } else {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `
                    <p>Effect is dispelled!</p>
                `,
                speaker: { actor: null, alias: "GM Helper" }
            });
            return;
        }
    }
    let target = workflow.targets.first();
    if (!target) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let dispelLevel = workflow.castData.castLevel;
    let effects = target.actor.effects.filter(e => e.isTemporary == 1 && e.active === true);
    if (!effects.length) {
        ui.notifications.warn('No effects to dispel!');
        return;
    }
    let selection = [];
    for (let i = 0; i < effects.length; i++) {
        let effect = effects[i];
        let level = effect.flags['midi-qol']?.castData?.castLevel;
        if (level === undefined) continue;
        let name = effect.name;
        let icon = effect.icon;
        selection.push([name, level, icon]);
    }
    function generateEnergyBox(type) {
        return `
            <label class="radio-label">
            <input type="radio" name="type" value="${selection[type]}" />
            <img src="${selection[type].slice(2)}" style="border: 0px; width: 50px; height: 50px"/>
            ${selection[type].slice(0, -2)}
            </label>
        `;
    }
    const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
    const content = `
        <style>
            .dispelMagic 
                .form-group {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    align-items: flex-start;
                }
            .dispelMagic 
                .radio-label {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                justify-items: center;
                flex: 1 0 20%;
                line-height: normal;
                }
            .dispelMagic 
                .radio-label input {
                display: none;
            }
            .dispelMagic img {
                border: 0px;
                width: 50px;
                height: 50px;
                flex: 0 0 50px;
                cursor: pointer;
            }
            /* CHECKED STYLES */
            .dispelMagic [type="radio"]:checked + img {
                outline: 2px solid #005c8a;
            }
        </style>
        <form class="dispelMagic">
            <div class="form-group" id="types">
                ${effectSelection}
            </div>
        </form>
    `;
    const effectToDispel = await new Promise((resolve) => {
        new Dialog({
            title: "Choose effect to dispel:",
            content,
            buttons: {
                ok: {
                    label: "Ok",
                    callback: async (html) => {
                        const element = html.find("input[type='radio'][name='type']:checked").val();
                        resolve(element);
                    },
                },
                cancel: {
                    label: "Cancel",
                    callback: async (html) => {
                        return;
                    }
                }
            }
        }).render(true);
    });
    let effectToDispelName = effectToDispel.split(",")[0];
    let effectToDispelLevel = +effectToDispel.substring(effectToDispel.indexOf(",") + 1).split(",")[0];
    let dispelEffect = await chrisPremades.helpers.findEffect(target.actor, effectToDispelName);
    if (!dispelEffect) {
        ui.notifications.warn("Something went wrong, unable to find the effect!");
        return;
    }
    if (dispelLevel >= effectToDispelLevel) {

        new Sequence()
        
            .effect()
            .file("jb2a.detect_magic.circle.grey")
            .atLocation(target)
            .anchor(0.5)
            .scaleToObject(1.5)
            .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-buff-short-8.mp3")

            .play();

        await warpgate.wait(150);
        await chrisPremades.helpers.removeEffect(dispelEffect);
    }
    else {
        let dispelDC = 10 + effectToDispelLevel;
        let ability = workflow.actor.system.attributes.spellcasting;
        let saveRoll = await chrisPremades.helpers.rollRequest(workflow.token, 'abil', ability);
        if (saveRoll.total >= dispelDC) {
            new Sequence()

                .effect()
                .file("jb2a.detect_magic.circle.grey")
                .atLocation(target)
                .anchor(0.5)
                .scaleToObject(1.5)
                .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-buff-short-8.mp3")

                .play();

            await warpgate.wait(150);
            await chrisPremades.helpers.removeEffect(dispelEffect);
        }
    }
}