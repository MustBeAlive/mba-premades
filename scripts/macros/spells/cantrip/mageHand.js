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
    let colors = [
        ['Blue', 'blue'],
        ['Green', 'green'],
        ['Purple', 'purple'],
        ['Red', 'red'],
        ['Rainbow', 'rainbow']
    ];
    let selectionColor = await mba.dialog(workflow.item.name, colors, "<b>Choose color:</b>");
    if (!selectionColor) selectionColor = "blue";
    if (telekinetic) {
        maxRange = 60;
        let choices = [["Yes", true], ["No", false]];
        invisible = await mba.dialog(workflow.item.name, choices, "<b>Do you want to make the hand invisible? (Telekinetic Feature)</b>");
    }
    let avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp";
    let selectedName = 'jb2a.arcane_hand.' + selectionColor;
    let selectedImg = await Sequencer.Database.getEntry(selectedName).file;
    if (selectionColor === "green") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp";
    else if (selectionColor === "purple") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp";
    else if (selectionColor === "red") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp";
    else if (selectionColor === "rainbow") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Rainbow_Thumb.webp";
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
    let animation = 'air';
    let hand = await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, maxRange, workflow.token, animation, {}, workflow.castData.castLevel);
    if (invisible === true) await mba.addCondition(hand.actor, "Invisible");
}