import {addActions} from './macros/actions/token.js';
import {cast} from './macros/animations/cast.js';
import {checkUpdate} from './update.js';
import {registerSettings} from './settings.js';
import {removeDumbV10Effects} from './macros/mechanics/conditions.js';
Hooks.once('init', () => {
    registerSettings();
});
Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Condition Fixes')) removeDumbV10Effects();
    Hooks.on('createToken', addActions);
});