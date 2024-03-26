import {addActions} from './macros/actions/token.js';
import {cast} from './macros/animations/cast.js';
import {checkUpdate} from './update.js';
import {deathSaves} from './macros/mechanics/deathsaves.js';
import {macros} from './macros.js';
import {mba as helpers} from './helperFunctions.js';
import {registerSettings} from './settings.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
Hooks.once('init', async function() {
    registerSettings();
});
Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Blindness Fix')) removeV10EffectsBlind();
    if (game.settings.get('mba-premades', 'Invisibility Fix')) removeV10EffectsInvisible();
    if (game.settings.get('mba-premades', 'Auto Death Save')) Hooks.on('updateCombat', deathSaves);
    if (game.settings.get('mba-premades', 'Blur')) Hooks.on('midi-qol.preItemRoll', macros.blur);
    Hooks.on('createToken', addActions);
});
globalThis['mbaPremades'] = {
    helpers,
    macros
}