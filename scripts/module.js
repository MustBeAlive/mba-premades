import {addActions} from './macros/actions/token.js';
import {addDAEFlags, colorizeDAETitleBarButton} from './integrations/dae.js';
import {appendStyles, modifyCSSVariables} from './macros/ui/changeTheme.js';
import {automatedAnimations} from './integrations/automatedAnimations.js';
import {buildABonus} from './integrations/buildABonus.js';
import {cast} from './macros/animations/cast.js';
import {changeFont} from './macros/ui/changeFont.js';
import {chatUnloader} from './macros/ui/chatUnloader.js';
import {checkUpdate} from './update.js';
import {constants} from './macros/generic/constants.js';
import {compendiumRender} from './macros/generic/compendium.js';
import {corpseHide} from './macros/mechanics/corpseHide.js';
import {createRollModeButtons} from './macros/ui/rollmodeButtons.js';
import {critFumble} from './macros/animations/critFumble.js';
import {deathSaves} from './macros/mechanics/deathSaves.js';
import {diceSoNice} from './integrations/diceSoNice.js';
import {diseases} from './macros/generic/diseases.js';
import {effectAuraHooks, effectAuras, effectSockets} from './macros/mechanics/effectAuras.js';
import {itemDC, noEffectAnimationCreate, noEffectAnimationDelete} from './macros/mechanics/activeEffect.js';
import {macros, onHitMacro} from './macros.js';
import {mba as helpers} from './helperFunctions.js';
import {patchSaves, patchSkills} from './patching.js';
import {queue} from './macros/mechanics/queue.js';
import {registerSettings} from './settings.js';
import {remoteAimCrosshair, remoteDialog, remoteDocumentDialog, remoteDocumentsDialog, remoteMenu, remoteSelectTarget} from './macros/generic/remoteDialog.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
import {rollModeChange} from './macros/ui/rollmodeButtons.js';
import {runAsGM, runAsUser} from './macros/generic/runAsGM.js';
import {summons} from './macros/generic/summons.js';
import {summonEffects} from './macros/animations/summonEffects.js';
import {tashaSummon} from './macros/generic/tashaSummon.js';
import {templateMacroTitleBarButton} from './integrations/templateMacro.js';
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
    if (game.settings.get('mba-premades', 'Chat Unloader')) libWrapper.register('mba-premades', 'ChatLog.prototype._onScrollLog', chatUnloader, 'MIXED');
});

Hooks.once('socketlib.ready', async function() {
    socket = socketlib.registerModule('mba-premades');
    socket.register('createCombatant', tashaSummon.createCombatant);
    socket.register('createActor', runAsGM.createActor);
    socket.register('createEffect', runAsGM.createEffect);
    socket.register('createFolder', runAsGM.createFolder);
    socket.register('createScene', runAsGM.createScene);
    socket.register('createTile', runAsGM.createTile);
    socket.register('deleteScene', runAsGM.deleteScene);
    socket.register('deleteTile', runAsGM.deleteTile);
    socket.register('remoteAddEffectAura', effectSockets.remoteAdd);
    socket.register('remoteAimCrosshair', remoteAimCrosshair);
    socket.register('remoteDialog', remoteDialog);
    socket.register('remoteDocumentDialog', remoteDocumentDialog);
    socket.register('remoteDocumentsDialog', remoteDocumentsDialog);
    socket.register('remoteMenu', remoteMenu);
    socket.register('remoteRemoveEffectAura', effectSockets.remoteRemove);
    socket.register('remoteSelectTarget', remoteSelectTarget);
    socket.register('removeEffect', runAsGM.removeEffect);
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
        game.settings.set('mba-premades', 'LastGM', game.user.id);
        if (game.settings.get('mba-premades', 'Tasha Actors')) await tashaSummon.setupFolder();
        if (game.settings.get('mba-premades', 'Auto Death Save')) Hooks.on('updateCombat', deathSaves);
        if (game.settings.get('mba-premades', 'Corpse Hider')) Hooks.on('updateCombat', corpseHide);
        if (game.settings.get('mba-premades', 'Combat Listener')) Hooks.on('updateCombat', combatUpdate);
        if (game.settings.get('mba-premades', 'Movement Listener')) {
            Hooks.on('preUpdateToken', tokenMovedEarly);
            Hooks.on('updateToken', tokenMoved);
        }
        if (game.settings.get('mba-premades', 'Effect Auras')) {
            Hooks.on('preUpdateActor', effectAuraHooks.preActorUpdate);
            Hooks.on('updateActor', effectAuraHooks.actorUpdate);
            Hooks.on('canvasReady', effectAuraHooks.canvasReady);
            Hooks.on('updateToken', effectAuraHooks.updateToken);
            Hooks.on('createToken', effectAuraHooks.createToken);
            Hooks.on('deleteToken', effectAuraHooks.deleteToken);
            Hooks.on('createActiveEffect', effectAuraHooks.createRemoveEffect);
            Hooks.on('deleteActiveEffect', effectAuraHooks.createRemoveEffect);
            effectAuras.registerAll();
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
    if (game.settings.get('mba-premades', 'Armor of Hexes')) Hooks.on('midi-qol.AttackRollComplete', macros.armorOfHexes.hook);
    if (game.settings.get('mba-premades', 'Beacon of Hope')) Hooks.on('midi-qol.preTargetDamageApplication', macros.beaconOfHope.hook);
    if (game.settings.get('mba-premades', 'Blur')) Hooks.on('midi-qol.preAttackRoll', macros.blur.hook);
    if (game.settings.get('mba-premades', 'Booming Blade')) Hooks.on('updateToken', macros.boomingBlade.moved);
    if (game.settings.get('mba-premades', 'Compelled Duel')) Hooks.on('updateToken', macros.compelledDuel.movement);
    if (game.settings.get('mba-premades', 'Compelled Duel')) Hooks.on('midi-qol.RollComplete', macros.compelledDuel.attacked);
    if (game.settings.get('mba-premades', 'Fog Cloud')) Hooks.on('midi-qol.preAttackRoll', macros.fogCloud.hook);
    if (game.settings.get('mba-premades', 'Darkness')) Hooks.on('midi-qol.preAttackRoll', macros.darkness.hook);
    if (game.settings.get('mba-premades', 'Death Ward')) Hooks.on('midi-qol.preTargetDamageApplication', macros.deathWard.hook);
    if (game.settings.get('mba-premades', 'Elusive')) Hooks.on('midi-qol.preAttackRoll', macros.elusive.hook);
    if (game.settings.get('mba-premades', 'Kuo-toa')) Hooks.on('midi-qol.AttackRollComplete', macros.monsters.kuotoa.stickyShield);
    if (game.settings.get('mba-premades', 'Mirror Image')) Hooks.on('midi-qol.AttackRollComplete', macros.mirrorImage.hook);
    if (game.settings.get('mba-premades', 'Nine Lives')) Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.chwinga.nineLives);
    if (game.settings.get('mba-premades', 'On Hit')) Hooks.on('midi-qol.RollComplete', onHitMacro);
    if (game.settings.get('mba-premades', 'Protection from Evil and Good')) Hooks.on('midi-qol.preAttackRoll', macros.protectionFromEvilAndGood.hook);
    if (game.settings.get('mba-premades', 'Relentless')) Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.relentless);
    if (game.settings.get('mba-premades', 'Relentless Endurance')) Hooks.on('midi-qol.preTargetDamageApplication', macros.relentlessEndurance);
    if (game.settings.get('mba-premades', 'Sanctuary')) Hooks.on('midi-qol.preItemRoll', macros.sanctuary.hook);
    if (game.settings.get('mba-premades', 'Strength of the Grave')) Hooks.on('midi-qol.preTargetDamageApplication', macros.strengthOfTheGrave);
    if (game.settings.get('mba-premades', 'True Strike')) Hooks.on('midi-qol.preAttackRoll', macros.trueStrike.hook);
    if (game.settings.get('mba-premades', 'Undead Fortitude')) Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.zombie.undeadFortitude);
    if (game.settings.get('mba-premades', 'Warding Bond')) {
        Hooks.on('updateToken', macros.wardingBond.moveTarget);
        Hooks.on('updateToken', macros.wardingBond.moveSource);
    }
    if (game.settings.get('mba-premades', 'Wildhunt')) Hooks.on('midi-qol.preAttackRoll', macros.shifting.wildhunt);
    if (game.settings.get('mba-premades', 'Active Effect Additions')) {
        Hooks.on('preCreateActiveEffect', itemDC);  
        Hooks.on('preCreateActiveEffect', noEffectAnimationCreate);
        Hooks.on('preDeleteActiveEffect', noEffectAnimationDelete);
    }
    if (game.settings.get('mba-premades', 'Skill Patching')) patchSkills(true);
    if (game.settings.get('mba-premades', 'Save Patching')) patchSaves(true);
    if (game.settings.get('mba-premades', 'Dice So Nice')) {
        Hooks.on('midi-qol.preItemRoll', diceSoNice.early);
        Hooks.on('midi-qol.DamageRollComplete', diceSoNice.late);
    }
    if (game.settings.get('mba-premades', 'Summons Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateSummonInitiative);
    if (game.settings.get('mba-premades', 'Companions Initiative')) Hooks.on('dnd5e.rollInitiative', tashaSummon.updateCompanionInitiative);
    if (game.settings.get('mba-premades', 'Cast Animations')) Hooks.on('midi-qol.postPreambleComplete', cast);
    if (game.settings.get('mba-premades', 'Crit and Fumble Animations')) Hooks.on('midi-qol.AttackRollComplete', critFumble);
    if (game.settings.get('mba-premades', 'Blindness Fix')) removeV10EffectsBlind();
    if (game.settings.get('mba-premades', 'Invisibility Fix')) removeV10EffectsInvisible();
    if (game.modules.get('dae')?.active) addDAEFlags();
    if (game.settings.get('mba-premades', 'Colorize Automated Animations')) {
        automatedAnimations.sortAutoRec();
        Hooks.on('renderItemSheet', automatedAnimations.titleBarButton);
    }
    if (game.settings.get('mba-premades', 'Colorize Build A Bonus')) {
        Hooks.on('renderItemSheet', buildABonus.titleBarButton);
        Hooks.on('renderDAEActiveEffectConfig', buildABonus.daeTitleBarButton);
        Hooks.on('renderActorSheet5e', buildABonus.actorTitleBarButtons);
    }
    if (game.settings.get('mba-premades', 'Build A Bonus Overlapping Effects')) Hooks.on('babonus.filterBonuses', buildABonus.overlappingEffects);
    if (game.settings.get('mba-premades', 'Colorize Dynamic Active Effects')) Hooks.on('renderItemSheet', colorizeDAETitleBarButton);
    if (game.settings.get('mba-premades', 'Colorize Template Macro')) Hooks.on('renderItemSheet', templateMacroTitleBarButton);
    Hooks.on('createToken', addActions);
    Hooks.on('renderCompendium', compendiumRender);
    Hooks.on("dnd5e.preRollHitDie", diseases.diseaseHitDie);
    Hooks.on("dnd5e.preRollHitDie", macros.items.potionOfVitality.hitDie);
    //Hooks.on("dnd5e.preLongRest", macros.diseases.diseaseLongRest1);
    //Hooks.on("dnd5e.restCompleted", macros.diseases.diseaseLongRest2);
});

globalThis['mbaPremades'] = {
    constants,
    effectAuras,
    helpers,
    macros,
    queue,
    summonEffects,
    summons,
    tashaSummon,
    tokenMove
}