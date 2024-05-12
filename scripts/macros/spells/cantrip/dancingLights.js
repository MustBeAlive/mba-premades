import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

export async function dancingLights({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName('MBA: Dancing Light');
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Dancing Light)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Dancing Light`;
    let sourceActors = [];
    let colors = [
        ["Blue Teal", "blueteal"],
        ["Blue Yellow", "blueyellow"],
        ["Green", "green"],
        ["Pink", "pink"],
        ["Purple Green", "purplegreen"],
        ["Red", "red"],
        ["Yellow", "yellow"]
    ]
    let selection = await mba.dialog(workflow.item.name, colors, `<b>Select color:</b>`);
    if (!selection) selection = "blueteal";
    let path = `jb2a.dancing_light.${selection}`;
    let selectedImg = await Sequencer.Database.getEntry(path).file;
    let avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_BlueTeal_Thumb.webp";
    if (selection === "blueyellow") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_BlueYellow_Thumb.webp";
    else if (selection === "green") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Green_Thumb.webp";
    else if (selection === "pink") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Pink_Thumb.webp";
    else if (selection === "purplegreen") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_PurpleGreen_Thumb.webp";
    else if (selection === "red") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Red_Thumb.webp";
    else if (selection === "yellow") avatarImg = "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Yellow_Thumb.webp";
    for (let i = 0; i < 4; i++) sourceActors.push(sourceActor);
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
    }
    let animation = 'celestial';
    await summons.spawn(sourceActors, updates, 60, workflow.item, undefined, undefined, 120, workflow.token, animation, {}, workflow.castData.castLevel);
}