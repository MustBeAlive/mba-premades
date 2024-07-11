import { mba } from "../../helperFunctions.js";

export async function weather() {
    ui.notifications.inf("Under construction!");
    return;
    let choices = [
        ["", ""],
        ["", ""],
        ["Reset Weather", "clear"]
    ];
    let selection = await mba.dialog("GM Helper: Weather", choices, "<b>Select weather:</b>");
    if (!selection) return;

    if (selection === "clear") {
        Hooks.call("fxmaster.updateParticleEffects", []);
        FXMASTER.filters.removeAll();
    }
}