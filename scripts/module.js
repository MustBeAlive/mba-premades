import {addActions} from './macros/actions/token.js';
import {cast} from './macros/animations/cast.js';
import {checkUpdate} from './update.js';
import {macros} from './macros.js';
import {registerSettings} from './settings.js';
import {removeDumbV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeDumbV10EffectsInvisible} from './macros/mechanics/invisibility.js';
Hooks.once('init', () => {
    registerSettings();
});
Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Blindness Fix')) removeDumbV10EffectsBlind();
    if (game.settings.get('mba-premades', 'Invisibility Fix')) removeDumbV10EffectsInvisible();
    Hooks.on('createToken', addActions);
});
globalThis['mbaPremades'] = {
    macros
}