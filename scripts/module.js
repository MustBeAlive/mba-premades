import {addMenuSetting, mbaSettingsGeneral} from './settingsMenu.js';
import {settingButton} from './settingsMenu';
import {checkUpdate} from './update.js';

Hooks.once('init', async function() {
    registerSettings();
});

Hooks.once('ready', async function() {
    if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate()
});
