import { arcaneBlight } from "./diseases/arcaneBlight.js";
import { blindingSickness } from "./diseases/blindingSickness.js";
import { blueMistFever } from "./diseases/blueMistFever.js";
import { bluerot } from "./diseases/bluerot.js";
import { filthFever } from "./diseases/filthFever.js";
import { fleshRot } from "./diseases/fleshRot.js";
import { seizure } from "./diseases/seizure.js";
import { sewerPlague } from "./diseases/sewerPlague.js";
import { shiveringSickness } from "./diseases/shiveringSickness.js";
import { sightRot } from "./diseases/sightRot.js";
import { sightRotOintment } from "./diseases/sightRot.js";
import { slimyDoom } from "./diseases/slimyDoom.js";
import { slimyDoomDamaged } from "./diseases/slimyDoom.js";
import { throatLeeches } from "./diseases/throatLeeches.js";


async function diseaseHitDie(actor, config, denom) {
    //console.log(actor); actor rolling
    //console.log(config); roll formula
    //console.log(denom); die number
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
    await chrisPremades.helpers.updateEffect(sightRot, updates)
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
