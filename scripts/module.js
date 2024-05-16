import {addActions} from './macros/actions/token.js';
import {addDAEFlags} from './integrations/dae.js';
import {appendStyles, modifyCSSVariables} from './macros/ui/changeTheme.js';
import {cast} from './macros/animations/cast.js';
import {changeFont} from './macros/ui/changeFont.js';
import {checkUpdate} from './update.js';
import {constants} from './macros/generic/constants.js';
import {compendiumRender} from './macros/generic/compendium.js';
import {corpseHide} from './macros/mechanics/corpseHide.js';
import {createRollModeButtons} from './macros/ui/rollmodeButtons.js';
import {critFumble} from './macros/animations/critFumble.js';
import {deathSaves} from './macros/mechanics/deathSaves.js';
import {diseases} from './macros/generic/diseases.js';
import {itemDC, noEffectAnimationCreate, noEffectAnimationDelete} from './macros/mechanics/activeEffect.js';
import {macros, onHitMacro} from './macros.js';
import {mba as helpers} from './helperFunctions.js';
import {queue} from './macros/mechanics/queue.js';
import {registerSettings} from './settings.js';
import {remoteAimCrosshair, remoteDialog, remoteDocumentDialog, remoteDocumentsDialog, remoteMenu} from './macros/generic/remoteDialog.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
import {rollModeChange} from './macros/ui/rollmodeButtons.js';
import {runAsGM, runAsUser} from './macros/generic/runAsGM.js';
import {summons} from './macros/generic/summons.js';
import {summonEffects} from './macros/animations/summonEffects.js';
import {tashaSummon} from './macros/generic/tashaSummon.js';
import {tokenMove, tokenMoved, combatUpdate, updateMoveTriggers, updateGMTriggers, loadTriggers, tokenMovedEarly} from './macros/mechanics/movement.js';
export let socket;

Hooks.once('init', async function() {
    registerSettings();
    if(game.settings.get('mba-premades', 'Dark Theme')) {
        appendStyles('modules/mba-premades/css/init.css');
        modifyCSSVariables();
    }
    if (game.settings.get('mba-premades', 'Font Change')) {
        changeFont();
        appendStyles('modules/mba-premades/css/fonts.css');
    }
    ChatLog._setRollMode = rollModeChange;
    if (game.settings.get('mba-premades', 'Rollmode Buttons')) Hooks.on('renderChatLog', createRollModeButtons);
});

Hooks.once('socketlib.ready', async function() {
    socket = socketlib.registerModule('mba-premades');
    socket.register('createCombatant', tashaSummon.createCombatant);
    socket.register('createActor', runAsGM.createActor);
    socket.register('createEffect', runAsGM.createEffect);
    socket.register('createFolder', runAsGM.createFolder);
    socket.register('remoteAimCrosshair', remoteAimCrosshair);
    socket.register('remoteDialog', remoteDialog);
    socket.register('remoteDocumentDialog', remoteDocumentDialog);
    socket.register('remoteDocumentsDialog', remoteDocumentsDialog);
    socket.register('remoteMenu', remoteMenu);
    socket.register('rollItem', runAsUser.rollItem);
    socket.register('updateCombatant', runAsGM.updateCombatant);
    socket.register('updateDoc', runAsGM.updateDoc);
    socket.register('updateEffect', runAsGM.updateEffect);
    socket.register('updateGMTriggers', updateGMTriggers);
    socket.register('updateInitiative', runAsGM.updateInitiative);
    socket.register('updateMoveTriggers', updateMoveTriggers);
});

Hooks.once('ready', async function() {
    if (game.user.isGM) {
        if (game.settings.get('mba-premades', 'Tasha Actors')) await tashaSummon.setupFolder();
        game.settings.set('mba-premades', 'LastGM', game.user.id);
        if (game.settings.get('mba-premades', 'Auto Death Save')) Hooks.on('updateCombat', deathSaves);
        if (game.settings.get('mba-premades', 'Corpse Hider')) Hooks.on('updateCombat', corpseHide);
        if (game.settings.get('mba-premades', 'On Hit')) Hooks.on('midi-qol.RollComplete', onHitMacro);
        if (game.settings.get('mba-premades', 'Combat Listener')) Hooks.on('updateCombat', combatUpdate);
        if (game.settings.get('mba-premades', 'Movement Listener')) {
            Hooks.on('preUpdateToken', tokenMovedEarly);
            Hooks.on('updateToken', tokenMoved);
        }
        if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
    }
    await loadTriggers();
    if (game.settings.get('mba-premades', 'Condition Resistance')) {
        Hooks.on('midi-qol.postPreambleComplete', macros.conditionResistanceEarly);
        Hooks.on('midi-qol.RollComplete', macros.conditionResistanceLate);
    }
    if (game.settings.get('mba-premades', 'Condition Vulnerability')) {
        Hooks.on('midi-qol.postPreambleComplete', macros.conditionVulnerabilityEarly);
        Hooks.on('midi-qol.RollComplete', macros.conditionVulnerabilityLate);
    }
    if (game.settings.get('mba-premades', 'Blur')) Hooks.on('midi-qol.preAttackRoll', macros.blur.hook);
    if (game.settings.get('mba-premades', 'Booming Blade')) Hooks.on('updateToken', macros.boomingBlade.moved);
    if (game.settings.get('mba-premades', 'Compelled Duel')) Hooks.on('updateToken', macros.compelledDuel.movement);
    if (game.settings.get('mba-premades', 'Compelled Duel')) Hooks.on('midi-qol.RollComplete', macros.compelledDuel.attacked);
    if (game.settings.get('mba-premades', 'Fog Cloud')) Hooks.on('midi-qol.preAttackRoll', macros.fogCloud.hook);
    if (game.settings.get('mba-premades', 'Darkness')) Hooks.on('midi-qol.preAttackRoll', macros.darkness.hook);
    if (game.settings.get('mba-premades', 'Death Ward')) Hooks.on('midi-qol.preTargetDamageApplication', macros.deathWard.hook);
    if (game.settings.get('mba-premades', 'Mirror Image')) Hooks.on('midi-qol.AttackRollComplete', macros.mirrorImage.hook);
    if (game.settings.get('mba-premades', 'Protection from Evil and Good')) Hooks.on('midi-qol.preAttackRoll', macros.protectionFromEvilAndGood.hook);
    if (game.settings.get('mba-premades', 'Relentless Endurance')) Hooks.on('midi-qol.preTargetDamageApplication', macros.relentlessEndurance);
    if (game.settings.get('mba-premades', 'Sanctuary')) Hooks.on('midi-qol.preItemRoll', macros.sanctuary.hook);
    if (game.settings.get('mba-premades', 'True Strike')) Hooks.on('midi-qol.preAttackRoll', macros.trueStrike.hook);
    if (game.settings.get('mba-premades', 'Strength of the Grave')) Hooks.on('midi-qol.preTargetDamageApplication', macros.strengthOfTheGrave);
    if (game.settings.get('mba-premades', 'Active Effect Additions')) {
        Hooks.on('preCreateActiveEffect', itemDC);  
        Hooks.on('preCreateActiveEffect', noEffectAnimationCreate);
        Hooks.on('preDeleteActiveEffect', noEffectAnimationDelete);
    }
    if (game.settings.get('mba-premades', 'Summons Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateSummonInitiative);
    if (game.settings.get('mba-premades', 'Companions Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateCompanionInitiative);
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Crit and Fumble Animations')) Hooks.on('midi-qol.AttackRollComplete', critFumble);
    if (game.settings.get('mba-premades', 'Blindness Fix')) removeV10EffectsBlind();
    if (game.settings.get('mba-premades', 'Invisibility Fix')) removeV10EffectsInvisible();
    if (game.modules.get('dae')?.active) addDAEFlags();
    Hooks.on('createToken', addActions);
    Hooks.on('renderCompendium', compendiumRender);
    Hooks.on("dnd5e.preRollHitDie", diseases.diseaseHitDie);
    //Hooks.on("dnd5e.preLongRest", macros.diseases.diseaseLongRest1);
    //Hooks.on("dnd5e.restCompleted", macros.diseases.diseaseLongRest2);
});

globalThis['mbaPremades'] = {
    constants,
    helpers,
    macros,
    queue,
    summonEffects,
    summons,
    tashaSummon,
    tokenMove
}