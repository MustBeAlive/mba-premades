import {addActions} from './macros/actions/token.js';
import {cast} from './macros/animations/cast.js';
import {changeChat} from './macros/ui/changeChat.js';
import {checkUpdate} from './update.js';
import {corpseHide} from './macros/mechanics/corpseHide.js';
import {createRollModeButtons} from './macros/ui/rollmodeButtons.js';
import {deathSaves} from './macros/mechanics/deathSaves.js';
import {macros} from './macros.js';
import {mba as helpers} from './helperFunctions.js';
import {registerSettings} from './settings.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
import {rollModeChange} from './macros/ui/rollmodeButtons.js';
import {summons} from './macros/generic/summons.js';
import {tashaSummon} from './macros/generic/tashaSummon.js';
export let socket;

Hooks.once('init', async function() {
    registerSettings();
    changeChat(game.settings.get('mba-premades', 'Dark Chat'), 'darkChat');
    ChatLog._setRollMode = rollModeChange;
    if (game.settings.get('mba-premades', 'Rollmode Buttons')) Hooks.on('renderChatLog', createRollModeButtons);
});

Hooks.once('socketlib.ready', async function() {
    socket = socketlib.registerModule('mba-premades');
    socket.register('createCombatant', tashaSummon.createCombatant);
});

Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Tasha Actors')) await tashaSummon.setupFolder();
        game.settings.set('mba-premades', 'LastGM', game.user.id);
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    if (game.settings.get('mba-premades', 'Blindness Fix')) removeV10EffectsBlind();
    if (game.settings.get('mba-premades', 'Invisibility Fix')) removeV10EffectsInvisible();
    Hooks.on('createToken', addActions);
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Auto Death Save')) Hooks.on('updateCombat', deathSaves);
    if (game.settings.get('mba-premades', 'Corpse Hider')) Hooks.on('updateCombat', corpseHide);
    if (game.settings.get('mba-premades', 'Blur')) Hooks.on('midi-qol.preAttackRoll', macros.blur.hook);
    if (game.settings.get('mba-premades', 'Fog Cloud')) Hooks.on('midi-qol.preAttackRoll', macros.fogCloud.hook);
    if (game.settings.get('mba-premades', 'Darkness')) Hooks.on('midi-qol.preAttackRoll', macros.darkness.hook);
    if (game.settings.get('mba-premades', 'Death Ward')) Hooks.on('midi-qol.preTargetDamageApplication', macros.deathWard.hook);
    if (game.settings.get('mba-premades', 'Mirror Image')) Hooks.on('midi-qol.AttackRollComplete', macros.mirrorImage.hook);
    if (game.settings.get('mba-premades', 'Relentless Endurance')) Hooks.on('midi-qol.preTargetDamageApplication', macros.relentlessEndurance);
    if (game.settings.get('mba-premades', 'Sanctuary')) Hooks.on('midi-qol.preItemRoll', macros.sanctuary.hook);
    if (game.settings.get('mba-premades', 'Summons Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateSummonInitiative);
    if (game.settings.get('mba-premades', 'Companions Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateCompanionInitiative);
});

globalThis['mbaPremades'] = {
    helpers,
    macros,
    summons,
    tashaSummon
}