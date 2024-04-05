import {addActions} from './macros/actions/token.js';
import {cast} from './macros/animations/cast.js';
import {changeChat} from './macros/ui/changeChat.js';
import {checkUpdate} from './update.js';
import {deathSaves} from './macros/mechanics/deathsaves.js';
import {macros} from './macros.js';
import {mba as helpers} from './helperFunctions.js';
import {registerSettings} from './settings.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
import {runAsGM, runAsUser} from './runAsGm.js';
export let socket;
Hooks.once('init', async function() {
    registerSettings();
    changeChat(game.settings.get('mba-premades', 'Dark Chat'), 'darkChat');
});
Hooks.once('socketlib.ready', async function() {
    socket = socketlib.registerModule('mba-premades');
    socket.register('updateCombatant', runAsGM.updateCombatant);
    socket.register('updateWall', runAsGM.updateWall);
    socket.register('updateEffect', runAsGM.updateEffect);
    socket.register('createEffect', runAsGM.createEffect);
    socket.register('removeEffect', runAsGM.removeEffect);
    socket.register('rollItem', runAsUser.rollItem);
    socket.register('createFolder', runAsGM.createFolder);
    socket.register('createActor', runAsGM.createActor);
    socket.register('updateInitiative', runAsGM.updateInitiative);
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