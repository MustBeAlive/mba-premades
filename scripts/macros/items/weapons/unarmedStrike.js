//PHB 2024
import {actions} from "../../actions/actions.js";
import {mba} from "../../../helperFunctions.js";

export async function unarmedStrike({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Deal Damage", "damage", "modules/mba-premades/icons/weapons/unarmed_strike.webp"],
        ["Grapple", "grapple", "modules/mba-premades/icons/conditions/grappled.webp"],
        ["Shove", "shove", "modules/mba-premades/icons/actions/shove.webp"],
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Unarmed Strike", choices, "<b>What would you like to do?</b>", "value");
    await mba.clearPlayerDialogMessage();
    if (!selection) return false;
    if (selection === "damage") return;
    else if (selection === "grapple") { //old
        await actions.grapple({ speaker, actor, token, character, item, args, scope, workflow });
        return false;
    }
    else if (selection === "shove") { //old
        await actions.shove({ speaker, actor, token, character, item, args, scope, workflow });
        return false;
    }
}