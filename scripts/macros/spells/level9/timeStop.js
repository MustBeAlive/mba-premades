import {mba} from "../../../helperFunctions.js";

// To do: whole spell (how?); better icon (make smth out of bg3 slow)

export async function timeStop({ speaker, actor, token, character, item, args, scope, workflow }) {
    let timeStopRoll = await new Roll("1d4 + 1").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(timeStopRoll);
    timeStopRoll.toMessage({
        rollMode: "roll",
        speaker: { alias: name },
        flavor: "Time Stop: Subsequent Turns"
    });
}