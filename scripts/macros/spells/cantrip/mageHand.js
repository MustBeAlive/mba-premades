import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

export async function mageHand({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA - Mage Hand");
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Mage Hand)');
        return;
    }
    let tokenName = `${workflow.token.document.name} Mage Hand`;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition
            }
        },
        'token': {
            'name': tokenName,
            'disposition': workflow.token.document.disposition
        }
    };
    let choices = [
        ['Blue', 'blue'],
        ['Green', 'green'],
        ['Purple', 'purple'],
        ['Red', 'red'],
        ['Rainbow', 'rainbow']
    ];
    let avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp";
    let selectionColor = await mba.dialog('What Color', choices);
    if (!selectionColor) selectionColor = "blue";
    let selectedName = 'jb2a.arcane_hand.' + selectionColor;
    let selectedImg = await Sequencer.Database.getEntry(selectedName).file;
    if (selectionColor === "green") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp";
    if (selectionColor === "purple") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp";
    if (selectionColor === "red") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp";
    if (selectionColor === "rainbow") avatarImg = "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Rainbow_Thumb.webp";
    updates.actor.img = avatarImg;
    let tokenImg = selectedImg;
    if (tokenImg) {
        setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        setProperty(updates, 'token.texture.src', tokenImg);
    }
    let animation = 'celestial';
    await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, animation, {}, workflow.castData.castLevel);
}