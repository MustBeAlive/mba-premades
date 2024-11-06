import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

export async function mageHand({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, "Mage Hand");
    if (effect) await mba.removeEffect(effect);
    let sourceActor = game.actors.getName("MBA: Mage Hand");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Mage Hand)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Mage Hand`;
    let telekinetic = await mba.getItem(workflow.actor, "Telekinetic");
    let maxRange = 30;
    let invisible = false;
    let images = [
        ["Blue", "blue", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp"],
        ["Green", "green", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp"],
        ["Purple", "purple", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp"],
        ["Red", "red", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp"],
        ["Rainbow", "rainbow", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Rainbow_Thumb.webp"],
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Mage Hand", images, "<b>Select color:</b>", "both");
    if (!selection) selection = ["blue", "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp"];
    await mba.clearPlayerDialogMessage();
    let avatarImg = selection[1];
    let selectedName = `jb2a.arcane_hand.${selection[0]}`;
    let selectedImg = await Sequencer.Database.getEntry(selectedName).file;
    if (telekinetic) {
        maxRange = 60;
        let choices = [["Yes", true], ["No", false]];
        invisible = await mba.dialog("Mage Hand: Telekinetic", choices, "<b>Do you want to make the hand invisible? (Telekinetic Feature)</b>");
    }
    let updates = {
        'actor': {
            'img': avatarImg,
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
                'texture': {
                    'src': selectedImg
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
            'texture': {
                'src': selectedImg
            }
        }
    };
    await mba.playerDialogMessage(game.user);
    let hand = await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, maxRange, workflow.token, "air", {}, workflow.castData.castLevel);
    await mba.clearPlayerDialogMessage();
    if (invisible === true) await mba.addCondition(hand.actor, "Invisible");
}