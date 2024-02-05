import {addActions} from './macros/actions/token.js';
import {checkUpdate} from './update.js';
import {registerSettings} from './settings.js';
import {rollModeChange, createRollModeButtons} from './buttons.mjs';
Hooks.once('init', () => {
    registerSettings();
    ChatLog._setRollMode = rollModeChange;
});
Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    Hooks.on('createToken', addActions);
    Hooks.on('renderChatLog', createRollModeButtons);
});
