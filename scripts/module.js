import {actionsTab} from './integrations/tidy5eSheet.js';
import {addActions} from './macros/actions/token.js';
import {checkUpdate} from './update.js';
import {mba as helpers} from "./helperFunctions.js";
import {registerSettings} from './settings.js';
Hooks.once('init', () => {
    registerSettings();
});
Hooks.once('ready', () => {
    if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();

    Hooks.on('createToken', addActions);
});
//Hooks.once('tidy5e-sheet.ready', actionsTab);