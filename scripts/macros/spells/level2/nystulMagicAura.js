import {mba} from "../../../helperFunctions.js";

// To do: the actual spell >.<

export async function nystulMagicAura({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [["False Aura (hide magic)", "magic"], ["Mask (hide type)", "detection"]];
    let selection = await mba.dialog("Nystul's Magic Aura", choices, `<b>Choose effect:</b>`);
    if (!selection) return;
    if (selection === "magic") {
        ui.notifications.info("under construction");
        return;
        /*let effectData = {

        };
        await mba.createEffect(target.actor, effectData);*/
    }
    else if (selection === "detection") {
        let choicesType = [
            ["Aberration", "aberration"],
            ["Beast", "beast"],
            ["Celestial", "celestial"],
            ["Construct", "construct"],
            ["Dragon", "dragon"],
            ["Elemental", "elemental"],
            ["Fey", "fey"],
            ["Fiend", "fiend"],
            ["Giant", "giant"],
            ["Humanoid", "humanoid"],
            ["Monstrosity", "monstrosity"],
            ["Ooze", "ooze"],
            ["Plant", "plant"],
            ["Undead", "undead"]
        ];
        let selectionType = await mba.dialog("Nystul's Magic Aura: Type", choicesType, `Choose creature type:`);
        if (!selectionType) return;
        let effectData = {
            'name': "Nystul's Magic Aura",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>For the duration, you appear as <b>${selectionType}</b> to spells and magical effects that detect creature types.</p>
            `,
            'duration': {
                'seconds': 86400
            },
            'flags': {
                'mba-premades': {
                    'spell': {
                        'nystulMagicAura': {
                            'type': selectionType
                        }
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
}