import {arcaneBlight} from "./diseases/arcaneBlight.js";
import {blindingSickness} from "./diseases/blindingSickness.js";
import {blueMistFever} from "./diseases/blueMistFever.js";
import {bluerot} from "./diseases/bluerot.js";
import {cackleFever, cackleFeverDamaged, cackleFeverTrigger} from "./diseases/cackleFever.js";
import {filthFever} from "./diseases/filthFever.js";
import {fleshRot} from "./diseases/fleshRot.js";
import {seizure} from "./diseases/seizure.js";
import {sewerPlague} from "./diseases/sewerPlague.js";
import {shiveringSickness} from "./diseases/shiveringSickness.js";
import {sightRot} from "./diseases/sightRot.js";
import {sightRotOintment} from "./diseases/sightRot.js";
import {slimyDoom} from "./diseases/slimyDoom.js";
import {slimyDoomDamaged} from "./diseases/slimyDoom.js";
import {throatLeeches} from "./diseases/throatLeeches.js";
import {mba} from "../../helperFunctions.js";

async function creator() {
    let target;
    if (!game.user._lastSelected) target = game.user.targets.first();
    else target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Need to select or target token!");
        return;
    }
    if (mba.checkTrait(target.actor, "ci", "diseased")) {
        ui.notifications.info("Target is immune to diseases!");
        return;
    }
    let choices = [
        ["Arcane Blight", "arcaneBlight"],
        ["Blinding Sickness", "blindingSickness"],
        ["Blue Mist Fever", "blueMistFever"],
        ["Blue Rot", "bluerot"],
        ["Cackle Fever", "cackleFever"],
        ["Filth Fever", "filthFever"],
        ["Flesh Rot", "fleshRot"],
        ["Seizure", "seizure"],
        ["Sewer Plague", "sewerPlague"],
        ["Shivering Sickness", "shiveringSickness"],
        ["Sight Rot", "sightRot"],
        ["Slimy Doom", "slimyDoom"],
        ["Throat Leeches", "throatLeeches"]
    ];
    let selection = await mba.dialog("Disease Creator", choices, `<b>Choose disease to apply:</b>`);
    if (!selection) return;
    if (selection === "arcaneBlight") await arcaneBlight();
    else if (selection === "blindingSickness") await blindingSickness();
    else if (selection === "blueMistFever") await blueMistFever();
    else if (selection === "bluerot") await bluerot();
    else if (selection === "cackleFever") await cackleFever();
    else if (selection === "filthFever") await filthFever();
    else if (selection === "fleshRot") await fleshRot();
    else if (selection === "seizure") await seizure();
    else if (selection === "sewerPlague") await sewerPlague();
    else if (selection === "shiveringSickness") await shiveringSickness();
    else if (selection === "sightRot") await sightRot();
    else if (selection === "slimyDoom") await slimyDoom();
    else if (selection === "throatLeeches") await throatLeeches();
}

async function diseaseHitDie(actor, config, denom) {
    //console.log(actor);// actor rolling
    //console.log(config);// roll formula
    //console.log(denom);// die number
    let effects = actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague" || e.flags['mba-premades']?.name === "Shivering Sickness");
    if (!effects.length) return;
    config.formula = `max(0, ceil((1${denom} + @abilities.con.mod)/2))`;
    return;
}

async function diseaseLongRest1(actor) {
    console.log(arguments);
    let [sightRot] = actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
    if (!sightRot) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'longRest': actor.system.attributes.hp.value
            }
        }
    };
    await mba.updateEffect(sightRot, updates)
}

async function diseaseLongRest2(actor) {
    let [sightRot] = actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
    if (!sightRot) return;
    let value = sightRot.flags['mba-premades']?.longRest;
    await actor.update({ "system.attributes.hp.value": value });
}

export let diseases = {
    'arcaneBlight': arcaneBlight,
    'blindingSickness': blindingSickness,
    'blueMistFever': blueMistFever,
    'bluerot': bluerot,
    'cackleFever': cackleFever,
    'cackleFeverDamaged': cackleFeverDamaged,
    'cackleFeverTrigger': cackleFeverTrigger,
    'creator': creator,
    'diseaseHitDie': diseaseHitDie,
    'diseaseLongRest1': diseaseLongRest1,
    'diseaseLongRest2': diseaseLongRest2,
    'filthFever': filthFever,
    'fleshRot': fleshRot,
    'seizure': seizure,
    'sewerPlague': sewerPlague,
    'shiveringSickness': shiveringSickness,
    'sightRot': sightRot,
    'sightRotOintment': sightRotOintment,
    'slimyDoom': slimyDoom,
    'slimyDoomDamaged': slimyDoomDamaged,
    'throatLeeches': throatLeeches
}
