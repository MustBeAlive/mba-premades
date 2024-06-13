import {mba} from "../../../helperFunctions.js";

async function emergeFromShell({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Shell Defense");
    if (!effect) {
        ui.notifications.warn("You are not hiding in the shell!");
        return;
    };
    let choices = [["Yes, emerge", "yes"], ["No, keep staying in the shell", false]];
    let selection = await mba.dialog("Shell Defense", choices, `<b>Do you wish to emerge from the shell?</b>`);
    if (!selection) return;
    await mba.removeEffect(effect); 
}

export let tortle = {
    'emergeFromShell': emergeFromShell
}