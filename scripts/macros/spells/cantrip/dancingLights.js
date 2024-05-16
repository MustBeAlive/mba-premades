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
    let images = [
        ["Blue Teal", "blueteal", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_BlueTeal_Thumb.webp"],
        ["Blue Yellow", "blueyellow", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_BlueYellow_Thumb.webp"],
        ["Green", "green", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Green_Thumb.webp"],
        ["Pink", "pink", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Pink_Thumb.webp"],
        ["Purple Green", "purplegreen", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_PurpleGreen_Thumb.webp"],
        ["Red", "red", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Red_Thumb.webp"],
        ["Yellow", "yellow", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_Yellow_Thumb.webp"]
    ];
    let selection = await mba.selectImage("Dancing Lights", images, "<b>Select color:</b>", "both");
    if (!selection) selection = ["blueteal", "modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_BlueTeal_Thumb.webp"];
    let avatarImg = selection[1];
    let path = `jb2a.dancing_light.${selection[0]}`;
    let selectedImg = await Sequencer.Database.getEntry(path).file;
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