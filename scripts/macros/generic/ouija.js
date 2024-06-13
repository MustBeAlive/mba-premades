import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

export async function seanse() {
    // Check if the pointer actor exists on the scene
    let [pointer] = canvas.scene.tokens.filter(t => t.name === "Pointer");
    if (!pointer) {
        ui.notifications.warn("Unabel to find token! (Pointer)");
        return;
    }
    let ouija = pointer.object;

    // Map coordintaes of the letters, numbers and symbols
    let end = false;
    const ouija_map = {
        'letter_a': { x: 600, y: 600 },
        'letter_b': { x: 700, y: 600 },
        'letter_c': { x: 800, y: 600 },
        'letter_d': { x: 900, y: 600 },
        'letter_e': { x: 1000, y: 600 },
        'letter_f': { x: 500, y: 700 },
        'letter_g': { x: 600, y: 700 },
        'letter_h': { x: 700, y: 700 },
        'letter_i': { x: 800, y: 700 },
        'letter_j': { x: 900, y: 700 },
        'letter_k': { x: 1000, y: 700 },
        'letter_l': { x: 1100, y: 700 },
        'letter_m': { x: 500, y: 800 },
        'letter_n': { x: 600, y: 800 },
        'letter_o': { x: 700, y: 800 },
        'letter_p': { x: 800, y: 800 },
        'letter_q': { x: 900, y: 800 },
        'letter_r': { x: 1000, y: 800 },
        'letter_s': { x: 1100, y: 800 },
        'letter_t': { x: 500, y: 900 },
        'letter_u': { x: 600, y: 900 },
        'letter_v': { x: 700, y: 900 },
        'letter_w': { x: 800, y: 900 },
        'letter_x': { x: 900, y: 900 },
        'letter_y': { x: 1000, y: 900 },
        'letter_z': { x: 1100, y: 900 },
        'number_1': { x: 600, y: 1000 },
        'number_2': { x: 700, y: 1000 },
        'number_3': { x: 800, y: 1000 },
        'number_4': { x: 900, y: 1000 },
        'number_5': { x: 1000, y: 1000 },
        'number_6': { x: 600, y: 1100 },
        'number_7': { x: 700, y: 1100 },
        'number_8': { x: 800, y: 1100 },
        'number_9': { x: 900, y: 1100 },
        'number_0': { x: 1000, y: 1100 },
        'symbol_goodbye': { x: 800, y: 1200 },
        'symbol_no': { x: 900, y: 500 },
        'symbol_space': { x: 800, y: 500 },
        'symbol_yes': { x: 700, y: 500 },
    }
    let choices = [
        {
            'label': `Input text w/o commas and dots`,
            'type': 'text',
            'options': "",
        },
        {
            'label': `Yes`,
            'type': 'checkbox'
        },
        {
            'label': `No`,
            'type': 'checkbox'
        },
        {
            'label': `Goodbye`,
            'type': 'checkbox'
        },
        {
            'label': `End (check to hide at the end of the Sequence)`,
            'type': 'checkbox'
        },
    ];
    let selection = await mba.menu("Ouija Board", constants.okCancel, choices, true);
    if (!selection.buttons) return;
    let message = [];
    if (selection.inputs[0].length) message = selection.inputs[0].toLowerCase().split('');
    if (selection.inputs[1]) message.push('yes');
    if (selection.inputs[2]) message.push('no');
    if (selection.inputs[3]) message.push('goodbye');
    if (selection.inputs[4]) end = true;
    await ouija.document.update({ "hidden": 0 });
    await warpgate.wait(1250);
    let prev = "";
    let current = "";
    let position;
    for (let letter of message) {
        switch (letter) {
            case 'a': position = ouija_map.letter_a; break;
            case 'b': position = ouija_map.letter_b; break;
            case 'c': position = ouija_map.letter_c; break;
            case 'd': position = ouija_map.letter_d; break;
            case 'e': position = ouija_map.letter_e; break;
            case 'f': position = ouija_map.letter_f; break;
            case 'g': position = ouija_map.letter_g; break;
            case 'h': position = ouija_map.letter_h; break;
            case 'i': position = ouija_map.letter_i; break;
            case 'j': position = ouija_map.letter_j; break;
            case 'k': position = ouija_map.letter_k; break;
            case 'l': position = ouija_map.letter_l; break;
            case 'm': position = ouija_map.letter_m; break;
            case 'n': position = ouija_map.letter_n; break;
            case 'o': position = ouija_map.letter_o; break;
            case 'p': position = ouija_map.letter_p; break;
            case 'q': position = ouija_map.letter_q; break;
            case 'r': position = ouija_map.letter_r; break;
            case 's': position = ouija_map.letter_s; break;
            case 't': position = ouija_map.letter_t; break;
            case 'u': position = ouija_map.letter_u; break;
            case 'v': position = ouija_map.letter_v; break;
            case 'w': position = ouija_map.letter_w; break;
            case 'x': position = ouija_map.letter_x; break;
            case 'y': position = ouija_map.letter_y; break;
            case 'z': position = ouija_map.letter_z; break;
            case '0': position = ouija_map.number_0; break;
            case '1': position = ouija_map.number_1; break;
            case '2': position = ouija_map.number_2; break;
            case '3': position = ouija_map.number_3; break;
            case '4': position = ouija_map.number_4; break;
            case '5': position = ouija_map.number_5; break;
            case '6': position = ouija_map.number_6; break;
            case '7': position = ouija_map.number_7; break;
            case '8': position = ouija_map.number_8; break;
            case '9': position = ouija_map.number_9; break;
            case 'goodbye': position = ouija_map.symbol_goodbye; break;
            case 'yes': position = ouija_map.symbol_yes; break;
            case 'no': position = ouija_map.symbol_no; break;
            case ' ': position = ouija_map.symbol_space; break;
        };
        current = letter;
        if (prev === current) {
            await new Sequence()

                .animation()
                .on(ouija)
                .duration(650)
                .moveTowards({ x: position.x - 25, y: position.y }, { ease: "easeInOutCubic" })
                .waitUntilFinished()

                .animation()
                .on(ouija)
                .duration(650)
                .moveTowards({ x: position.x + 25, y: position.y }, { ease: "easeInOutCubic" })
                .waitUntilFinished()

                .animation()
                .on(ouija)
                .duration(650)
                .moveTowards({ x: position.x, y: position.y }, { ease: "easeInOutCubic" })
                .waitUntilFinished()

                .wait(100, 300)

                .play()

            prev = current;
            continue;
        }
        await new Sequence()

            .animation()
            .on(ouija)
            .duration(2000)
            .moveTowards({ x: position.x, y: position.y }, { ease: "easeInOutCubic" })
            .waitUntilFinished()

            .wait(100, 300)

            .play()
        prev = letter;
    }

    //End Sequence
    position = ouija_map.symbol_space;
    await new Sequence()

        .wait(1000)

        .animation()
        .on(ouija)
        .duration(3000)
        .moveTowards({ x: position.x, y: position.y }, { ease: "easeInOutCubic" })
        .waitUntilFinished()

        .thenDo(async () => {
            if (end) await ouija.document.update({ "hidden": 1 });
        })

        .play()
}