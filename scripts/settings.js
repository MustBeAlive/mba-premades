import {addMenuSetting, mbaSettingsAnimations, mbaSettingsClassFeats, mbaSettingsFeats, mbaSettingsHomewbrew, mbaSettingsGeneral, mbaSettingsInterface, mbaSettingsMechanics, mbaSettingsMonsterFeats, mbaSettingsRaceFeats, mbaSettingsSpells, mbaSettingsSummons} from './settingsMenu.js';
import {automatedAnimations} from './integrations/automatedAnimations.js';
import {buildABonus} from './integrations/buildABonus.js';
import {cast} from './macros/animations/cast.js';
import {colorizeDAETitleBarButton} from './integrations/dae.js';
import {corpseHide} from './macros/mechanics/corpseHide.js';
import {critFumble} from './macros/animations/critFumble.js';
import {deathSaves} from './macros/mechanics/deathSaves.js';
import {diceSoNice} from './integrations/diceSoNice.js';
import {effectAuraHooks} from './macros/mechanics/effectAuras.js';
import {itemDC, noEffectAnimationCreate, noEffectAnimationDelete} from './macros/mechanics/activeEffect.js';
import {macros, onHitMacro} from './macros.js';
import {patchSaves, patchSkills} from './patching.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
import {tashaSummon} from './macros/generic/tashaSummon.js';
import {templateMacroTitleBarButton} from './integrations/templateMacro.js';
import {tokenMoved, combatUpdate, tokenMovedEarly} from './macros/mechanics/movement.js';

let moduleName = 'mba-premades';

export function registerSettings() {
    game.settings.register(moduleName, 'LastGM', {
        'name': 'LastGM',
        'hint': 'Отслеживает подключенного ГМа.',
        'scope': 'world',
        'config': false,
        'type': String
    });

    game.settings.register(moduleName, 'Movement Triggers', {
        'name': 'Movement Triggers',
        'hint': 'Синхронизирует передвижение.',
        'scope': 'world',
        'config': false,
        'type': Object,
        'default': {}
    });

    game.settings.register(moduleName, 'Active Effect Additions', {
        'name': 'Дополнения к Активным Эффектам',
        'hint': 'Эта настройка добавляет возможность макросам использовать дополнительные "опции" для активных эффектов.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': true,
        'onChange': value => {
            if (value) {
                Hooks.on('preCreateActiveEffect', itemDC);
                Hooks.on('preCreateActiveEffect', noEffectAnimationCreate);
                Hooks.on('preDeleteActiveEffect', noEffectAnimationDelete);
            } else {
                Hooks.off('preCreateActiveEffect', itemDC);
                Hooks.off('preCreateActiveEffect', noEffectAnimationCreate);
                Hooks.off('preDeleteActiveEffect', noEffectAnimationDelete);
            }
        }
    });
    addMenuSetting('Active Effect Additions', 'General');

    game.settings.register(moduleName, 'Add Generic Actions', {
        'name': "Добавить базовые действия",
        'hint': "Добавляет базовые действия в лист персонажа при дропе токена на карту",
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'none',
        'choices': {
            'none': 'Выключено',
            'all': "Все Actor'ы",
            'npc': "Только NPC Actor'ы",
            'character': "Только Character Actor'ы",
            'uNpc': "Только не-линкованные NPC Actor'ы",
            'uCharacter': "Только не-линкованные Character Actor'ы",
            'lNpc': "Только линкованные NPC Actor'ы",
            'lCharacter': "Только линкованные Character Actor'ы"
        }
    });
    addMenuSetting('Add Generic Actions', 'General');

    game.settings.register(moduleName, 'Check For Updates', {
        'name': "Проверять обновления",
        'hint': "Показывать сообщение при входе в мир если доступно обновление модуля.",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false
    });
    addMenuSetting('Check For Updates', 'General');

    game.settings.register(moduleName, 'Combat Listener', {
        'name': 'Отслеживание Боя',
        'hint': 'Включает автоматизацию отслеживания состояния боя.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value && game.user.isGM) {
                Hooks.on('updateCombat', combatUpdate);
            } else if (game.user.isGM) {
                Hooks.off('updateCombat', combatUpdate);
            }
        }
    });
    addMenuSetting('Combat Listener', 'General');

    game.settings.register(moduleName, 'Build A Bonus Overlapping Effects', {
        'name': 'Совместимость для Build A Bonus',
        'hint': 'Позволяет эффектам от модуля Build a Bonus учитывать "overlap".',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('babonus.filterBonuses', buildABonus.overlappingEffects);
            } else {
                Hooks.off('babonus.filterBonuses', buildABonus.overlappingEffects);
            }
        }
    });
    addMenuSetting('Build A Bonus Overlapping Effects', 'General');

    game.settings.register(moduleName, 'Dice So Nice', {
        'name': 'Совместимость для Dice So Nice',
        'hint': 'Обновляет значения на 3d кубах в соответствии с работой макросов изменяющих результаты бросков.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preItemRoll', diceSoNice.early);
                Hooks.on('midi-qol.DamageRollComplete', diceSoNice.late);
            } else {
                Hooks.off('midi-qol.preItemRoll', diceSoNice.early);
                Hooks.off('midi-qol.DamageRollComplete', diceSoNice.late);
            }
        }
    });
    addMenuSetting('Dice So Nice', 'General');

    game.settings.register(moduleName, 'Effect Auras', {
        'name': 'Автоматизация Аур',
        'hint': 'Включает автоматизацию аур.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value && game.user.isGM) {
                Hooks.on('preUpdateActor', effectAuraHooks.preActorUpdate);
                Hooks.on('updateActor', effectAuraHooks.actorUpdate);
                Hooks.on('canvasReady', effectAuraHooks.canvasReady);
                Hooks.on('updateToken', effectAuraHooks.updateToken);
                Hooks.on('createToken', effectAuraHooks.createToken);
                Hooks.on('deleteToken', effectAuraHooks.deleteToken);
                Hooks.on('createActiveEffect', effectAuraHooks.createRemoveEffect);
                Hooks.on('deleteActiveEffect', effectAuraHooks.createRemoveEffect);
            } else if (game.user.isGM) {
                Hooks.off('preUpdateActor', effectAuraHooks.preActorUpdate);
                Hooks.off('updateActor', effectAuraHooks.actorUpdate);
                Hooks.off('canvasReady', effectAuraHooks.canvasReady);
                Hooks.off('updateToken', effectAuraHooks.updateToken);
                Hooks.off('createToken', effectAuraHooks.createToken);
                Hooks.off('deleteToken', effectAuraHooks.deleteToken);
                Hooks.off('createActiveEffect', effectAuraHooks.createRemoveEffect);
                Hooks.off('deleteActiveEffect', effectAuraHooks.createRemoveEffect);
            }
        }
    });
    addMenuSetting('Effect Auras', 'General');

    game.settings.register(moduleName, 'Movement Listener', {
        'name': 'Отслеживание Передвижения',
        'hint': 'Включает автоматизацию отслеживания передвижения токенов.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value && game.user.isGM) {
                Hooks.on('updateToken', tokenMoved);
                Hooks.on('preUpdateToken', tokenMovedEarly);
            } else if (game.user.isGM) {
                Hooks.off('updateToken', tokenMoved);
                Hooks.off('preUpdateToken', tokenMovedEarly);
            }
        }
    });
    addMenuSetting('Movement Listener', 'General');

    game.settings.register(moduleName, 'On Hit', {
        'name': 'Отслеживание Попаданий',
        'hint': 'Включает автоматизацию срабатываний способностей/заклинаний при попадании.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.RollComplete', onHitMacro);
            } else {
                Hooks.off('midi-qol.RollComplete', onHitMacro);
            }
        }
    });
    addMenuSetting('On Hit', 'General');

    game.settings.register(moduleName, 'Priority Queue', {
        'name': 'Приоритетная Очередь',
        'hint': 'Позволяет макросам модуля срабатывать в заранее установленном порядке. Предотвращает ситуации с одновременным появлением нескольких поп-аут окон, а так же выстраивает модификации атак/урона в "правильный" порядок.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': true
    });
    addMenuSetting('Priority Queue', 'General');

    game.settings.register(moduleName, 'Show Names', {
        'name': 'Показывать имена',
        'hint': 'Включает показ имен токенов (вроде бы именно токенов) в диалогах-селекторах целей (используется в фичах/заклинаниях а-ля Bane/Bless).',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': true
    });
    addMenuSetting('Show Names', 'General');

    game.settings.register(moduleName, 'Save Patching', {
        'name': 'Модификация Спасбросков',
        'hint': 'Эта настройка позволяет макросам модифицировать спасброски.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            patchSaves(value);
        }
    });
    addMenuSetting('Save Patching', 'General');

    game.settings.register(moduleName, 'Skill Patching', {
        'name': 'Модификация проверок Навыков',
        'hint': 'Эта настройка позволяет макросам модифицировать проверки навыков.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            patchSkills(value);
        }
    });
    addMenuSetting('Skill Patching', 'General');

    game.settings.register(moduleName, 'Cast Animations', {
        'name': 'Анимации Заклинаний',
        'hint': 'Включает автоматический проигрыш анимаций от JB2A при сотворении любых заклинаний',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.postPreambleComplete', cast);
            } else {
                Hooks.off('midi-qol.postPreambleComplete', cast);
            }
        }
    });
    addMenuSetting('Cast Animations', 'Animations');

    game.settings.register(moduleName, 'Crit and Fumble Animations', {
        'name': 'Анимации критических Успехов и Провалов (атаки)',
        'hint': 'Включает автоматический проигрыш анимаций от JB2A при выпадении 1 и 20 на бросках атаки.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.AttackRollComplete', critFumble);
            } else {
                Hooks.off('midi-qol.AttackRollComplete', critFumble);
            }
        }
    });
    addMenuSetting('Crit and Fumble Animations', 'Animations');

    game.settings.register(moduleName, 'abj_color', {
        'name': 'Abjuration',
        'hint': 'Цвет для заклинаний школы abjuration',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'blue',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('abj_color', 'Animations');

    game.settings.register(moduleName, 'con_color', {
        'name': 'Conjuration',
        'hint': 'Цвет для заклинаний школы conjuration.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'yellow',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('con_color', 'Animations');

    game.settings.register(moduleName, 'div_color', {
        'name': 'Divination',
        'hint': 'Цвет для заклинаний школы divination.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'blue',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('div_color', 'Animations');

    game.settings.register(moduleName, 'enc_color', {
        'name': 'Enchantment',
        'hint': 'Цвет для заклинаний школы enchantment.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'pink',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('enc_color', 'Animations');

    game.settings.register(moduleName, 'evo_color', {
        'name': 'Evocation',
        'hint': 'Цвет для заклинаний школы evocation.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'red',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('evo_color', 'Animations');

    game.settings.register(moduleName, 'ill_color', {
        'name': 'Illusion',
        'hint': 'Цвет для заклинаний школы illusion.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'purple',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('ill_color', 'Animations');

    game.settings.register(moduleName, 'nec_color', {
        'name': 'Necromancy',
        'hint': 'Цвет для заклинаний школы necromancy.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'green',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('nec_color', 'Animations');

    game.settings.register(moduleName, 'trs_color', {
        'name': 'Transmutation',
        'hint': 'Цвет для заклинаний школы transmutation.',
        'scope': 'world',
        'config': false,
        'type': String,
        'default': 'yellow',
        'choices': {
            'blue': 'Blue',
            'green': 'Green',
            'pink': 'Pink',
            'purple': 'Purple',
            'red': 'Red',
            'yellow': 'Yellow'
        }
    });
    addMenuSetting('trs_color', 'Animations');

    game.settings.register(moduleName, 'Elusive', {
        'name': 'Rogue: Elusive',
        'hint': 'Включает автоматизацию способности Elusive через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.elusive.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.elusive.hook);
            }
        }
    });
    addMenuSetting('Elusive', 'Class Features');

    game.settings.register(moduleName, 'Strength of the Grave', {
        'name': 'Sorcerer (Shadow): Strength of the Grave',
        'hint': 'Включает автоматизацию способности Strength of the Grave через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.strengthOfTheGrave);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.strengthOfTheGrave);
            }
        }
    });
    addMenuSetting('Strength of the Grave', 'Class Features');

    game.settings.register(moduleName, 'Armor of Hexes', {
        'name': 'Warlock (Hexblade): Armor of Hexes',
        'hint': 'Включает автоматизацию способности Armor of Hexes через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.AttackRollComplete', macros.armorOfHexes.hook);
            } else {
                Hooks.off('midi-qol.AttackRollComplete', macros.armorOfHexes.hook);
            }
        }
    });
    addMenuSetting('Armor of Hexes', 'Class Features');

    game.settings.register(moduleName, 'Ranged Smite', {
        'name': 'Ranged Divine Smite',
        'hint': 'Включает срабатывание способности Divine Smite на RWAK (Ranged Weapon Attacks).',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false
    });
    addMenuSetting('Ranged Smite', 'Homebrew');

    game.settings.register(moduleName, 'Unarmed Strike Smite', {
        'name': 'Unarmed Strike Divine Smite',
        'hint': 'Включает срабатывание способности Divine Smite на Unarmed Strike.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false
    });
    addMenuSetting('Unarmed Strike Smite', 'Homebrew');

    game.settings.register(moduleName, 'Blindness Fix', {
        'name': 'Condition: Blinded (Visual Fix)',
        'hint': 'Эта настройка отключает ограничения видимости при получении Condition: Blinded',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) removeV10EffectsBlind();
        }
    });
    addMenuSetting('Blindness Fix', 'Mechanics');

    game.settings.register(moduleName, 'Invisibility Fix', {
        'name': 'Condition: Invisible (Visual Fix)',
        'hint': 'Эта настройка отключает ограничения видимости при получении Condition: Invisible',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) removeV10EffectsInvisible();
        }
    });
    addMenuSetting('Invisibility Fix', 'Mechanics');

    game.settings.register(moduleName, 'Auto Death Save', {
        'name': 'Auto Death Save Request',
        'hint': 'Эта настройка включает автоматический промт death save\'ов в бою (monk\'s token bar)',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on("updateCombat", deathSaves());
            } else {
                Hooks.off("updateCombat", deathSaves());
            }
        }
    });
    addMenuSetting('Auto Death Save', 'Mechanics');

    game.settings.register(moduleName, 'Condition Resistance', {
        'name': 'Condition Resistance',
        'hint': "Эта настройка включает автоматизацию condition resistance через Midi-Qol hooks.",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.postPreambleComplete', macros.conditionResistanceEarly);
                Hooks.on('midi-qol.RollComplete', macros.conditionResistanceLate);
            } else {
                Hooks.off('midi-qol.postPreambleComplete', macros.conditionResistanceEarly);
                Hooks.off('midi-qol.RollComplete', macros.conditionResistanceLate);
            }
        }
    });
    addMenuSetting('Condition Resistance', 'Mechanics');

    game.settings.register(moduleName, 'Condition Vulnerability', {
        'name': 'Condition Vulnerability',
        'hint': "Эта настройка включает автоматизацию condition vulnerability через Midi-Qol hooks.",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.postPreambleComplete', macros.conditionVulnerabilityEarly);
                Hooks.on('midi-qol.RollComplete', macros.conditionVulnerabilityLate);
            } else {
                Hooks.off('midi-qol.postPreambleComplete', macros.conditionVulnerabilityEarly);
                Hooks.off('midi-qol.RollComplete', macros.conditionVulnerabilityLate);
            }
        }
    });
    addMenuSetting('Condition Vulnerability', 'Mechanics');

    game.settings.register(moduleName, 'Corpse Hider', {
        'name': 'Corpse Hider',
        'hint': 'Включает автоматическое скрытие трупов для игроков, срабатывает при смене хода в бою.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on("updateCombat", corpseHide());
            } else {
                Hooks.off("updateCombat", corpseHide());
            }
        }
    });
    addMenuSetting('Corpse Hider', 'Mechanics');

    game.settings.register(moduleName, 'Chwinga', {
        'name': "Chwinga's Magical Secret: Nine Lives",
        'hint': 'Включает автоматизацию Charm of Nine Lives.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.chwinga.nineLives);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.monsters.chwinga.nineLives);
            }
        }
    });
    addMenuSetting('Chwinga', 'Monster Features');

    game.settings.register(moduleName, 'Goblin Boss', {
        'name': 'Goblin Boss: Redirect Attack',
        'hint': 'Включает автоматизацию способности Goblin Boss Redirect Attack.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.monsters.goblinBoss.redirectAttack);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.monsters.goblinBoss.redirectAttack);
            }
        }
    });
    addMenuSetting('Goblin Boss', 'Monster Features');

    game.settings.register(moduleName, 'Kuo-toa', {
        'name': 'Kuo-toa: Sticky Shield',
        'hint': 'Включает автоматизацию способности Kuo-toa "Sticky Shield".',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.AttackRollComplete', macros.monsters.kuotoa.stickyShield);
            } else {
                Hooks.off('midi-qol.AttackRollComplete', macros.monsters.kuotoa.stickyShield);
            }
        }
    });
    addMenuSetting('Kuo-toa', 'Monster Features');

    game.settings.register(moduleName, 'Merregon', {
        'name': 'Merregon: Loyal Bodyguard',
        'hint': 'Включает автоматизацию способности Merregon "Redirect Attack".',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.monsters.merregon.loyalBodyguard);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.monsters.merregon.loyalBodyguard);
            }
        }
    });
    addMenuSetting('Merregon', 'Monster Features');

    game.settings.register(moduleName, 'Mimic', {
        'name': 'Mimic: Adhesive',
        'hint': 'Включает автоматизацию способности Mimic "Adhesive".',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.AttackRollComplete', macros.monsters.mimic.adhesivePassive);
            } else {
                Hooks.off('midi-qol.AttackRollComplete', macros.monsters.mimic.adhesivePassive);
            }
        }
    });
    addMenuSetting('Mimic', 'Monster Features');

    game.settings.register(moduleName, 'Relentless', {
        'name': 'Relentless',
        'hint': 'Включает автоматизацию способности "Relentless" у Boar, Giant Boar и Wereboar.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.relentless);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.monsters.relentless);
            }
        }
    });
    addMenuSetting('Relentless', 'Monster Features');

    game.settings.register(moduleName, 'Quickling', {
        'name': 'Quickling: Blurred Movement',
        'hint': 'Включает автоматизацию способности Quickling "Blurred Movement".',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.monsters.quickling.blurredMovement);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.monsters.quickling.blurredMovement);
            }
        }
    });
    addMenuSetting('Quickling', 'Monster Features');

    game.settings.register(moduleName, 'Undead Fortitude', {
        'name': 'Undead Fortitude',
        'hint': 'Включает автоматизацию способности Undead Fortitude у нежити.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.monsters.zombie.undeadFortitude);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.monsters.zombie.undeadFortitude);
            }
        }
    });
    addMenuSetting('Undead Fortitude', 'Monster Features');

    game.settings.register(moduleName, 'Relentless Endurance', {
        'name': 'Orc: Relentless Endurance',
        'hint': 'Включает автоматизацию спобности Relentless Endurance через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.relentlessEndurance);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.relentlessEndurance);
            }
        }
    });
    addMenuSetting('Relentless Endurance', 'Race Features');

    
    game.settings.register(moduleName, 'Wildhunt', {
        'name': 'Shifter: Wildhunt',
        'hint': 'Включает автоматизацию спобности Wildhunt через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.shifting.wildhunt);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.shifting.wildhunt);
            }
        }
    });
    addMenuSetting('Wildhunt', 'Race Features');

    game.settings.register(moduleName, 'Beacon of Hope', {
        'name': 'Beacon of Hope',
        'hint': 'Включает автоматизацию заклинания Beacon of Hope через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.beaconOfHope.hook);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.beaconOfHope.hook);
            }
        }
    });
    addMenuSetting('Beacon of Hope', 'Spells');

    game.settings.register(moduleName, 'Blur', {
        'name': 'Blur',
        'hint': 'Включает автоматизацию заклинания Blur через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.blur.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.blur.hook);
            }
        }
    });
    addMenuSetting('Blur', 'Spells');

    game.settings.register(moduleName, 'Booming Blade', {
        'name': 'Booming Blade',
        'hint': 'Включает автоматизацию заклинания Booming Blade через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('updateToken', macros.boomingBlade.moved);
            } else {
                Hooks.off('updateToken', macros.boomingBlade.moved);
            }
        }
    });
    addMenuSetting('Booming Blade', 'Spells');

    game.settings.register(moduleName, 'Compelled Duel', {
        'name': 'Compelled Duel',
        'hint': 'Включает автоматизацию заклинания Compelled Duel через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                if (game.user.isGM) Hooks.on('updateToken', macros.compelledDuel.movement);
                Hooks.on('midi-qol.RollComplete', macros.compelledDuel.attacked);
            } else {
                if (game.user.isGM) Hooks.off('updateToken', macros.compelledDuel.movement);
                Hooks.off('midi-qol.RollComplete', macros.compelledDuel.attacked);
            }
        }
    });
    addMenuSetting('Compelled Duel', 'Spells');

    game.settings.register(moduleName, 'Fog Cloud', {
        'name': 'Fog Cloud',
        'hint': 'Включает автоматизацию заклинания Fog Cloud через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.fogCloud.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.fogCloud.hook);
            }
        }
    });
    addMenuSetting('Fog Cloud', 'Spells');

    game.settings.register(moduleName, 'Darkness', {
        'name': 'Darkness',
        'hint': 'Включает автоматизацию заклинания Darkness через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.darkness.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.darkness.hook);
            }
        }
    });
    addMenuSetting('Darkness', 'Spells');

    game.settings.register(moduleName, 'Death Ward', {
        'name': 'Death Ward',
        'hint': 'Включает автоматизацию заклинания Death Ward через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preTargetDamageApplication', macros.deathWard.hook);
            } else {
                Hooks.off('midi-qol.preTargetDamageApplication', macros.deathWard.hook);
            }
        }
    });
    addMenuSetting('Death Ward', 'Spells');

    game.settings.register(moduleName, 'Mirror Image', {
        'name': 'Mirror Image',
        'hint': 'Включает автоматизацию заклинания Mirror Image через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.AttackRollComplete', macros.mirrorImage.hook);
            } else {
                Hooks.off('midi-qol.AttackRollComplete', macros.mirrorImage.hook);
            }
        }
    });
    addMenuSetting('Mirror Image', 'Spells');

    game.settings.register(moduleName, 'Protection from Evil and Good', {
        'name': 'Protection from Evil and Good',
        'hint': 'Включает автоматизацию заклинания Protection from Evil and Good через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.protectionFromEvilAndGood.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.protectionFromEvilAndGood.hook);
            }
        }
    });
    addMenuSetting('Protection from Evil and Good', 'Spells');

    game.settings.register(moduleName, 'Sanctuary', {
        'name': 'Sanctuary',
        'hint': 'Включает автоматизацию заклинания Sanctuary через Midi-QoL hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preItemRoll', macros.sanctuary.hook);
            } else {
                Hooks.off('midi-qol.preItemRoll', macros.sanctuary.hook);
            }
        }
    });
    addMenuSetting('Sanctuary', 'Spells');

    game.settings.register(moduleName, 'True Strike', {
        'name': 'True Strike',
        'hint': 'Включает автоматизацию заклинания True Strike через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preAttackRoll', macros.trueStrike.hook);
            } else {
                Hooks.off('midi-qol.preAttackRoll', macros.trueStrike.hook);
            }
        }
    });
    addMenuSetting('True Strike', 'Spells');

    game.settings.register(moduleName, 'Warding Bond', {
        'name': 'Warding Bond',
        'hint': 'Включает автоматизацию заклинания Warding Bond через Midi-Qol hooks.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value && game.user.isGM) {
                Hooks.on('updateToken', macros.wardingBond.moveTarget);
                Hooks.on('updateToken', macros.wardingBond.moveSource);
            } else if (game.user.isGM) {
                Hooks.off('updateToken', macros.wardingBond.moveTarget);
                Hooks.off('updateToken', macros.wardingBond.moveSource);
            }
        }
    });
    addMenuSetting('Warding Bond', 'Spells');

    game.settings.register(moduleName, 'Tasha Actors', {
        'name': 'Keep Summon Actors Updated',
        'hint': 'This setting will keep actors from this module updated in the sidebar.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': async value => {
            if (value && game.user.isGM) await tashaSummon.setupFolder();
        }
    });
    addMenuSetting('Tasha Actors', 'Summons');

    game.settings.register(moduleName, 'Tasha Initiative', {
        'name': 'Minions use caster\'s initiative',
        'hint': 'Enabling this will have minions summoned from this module to use the caster\'s initiative instead of rolling their own.  Similar to the summon spells from Tasha\'s Cauldron Of Everything',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false
    });
    addMenuSetting('Tasha Initiative', 'Summons');

    game.settings.register(moduleName, 'Summons Initiative', {
        'name': 'Auto Update Summons Initiative',
        'hint': 'Automatically update player controlled warpgate summons\' initaitve to be just after the player\'s',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('dnd5e.rollInitiative', tashaSummon.updateSummonInitiative);
            } else {
                Hooks.off('dnd5e.rollInitiative', tashaSummon.updateSummonInitiative);
            }
        }
    });
    addMenuSetting('Summons Initiative', 'Summons');

    game.settings.register(moduleName, 'Companions Initiative', {
        'name': 'Auto Update Companions Initiative',
        'hint': 'Automatically update player owned NPCs\' initiative to be just after the player\'s',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('dnd5e.rollInitiative', tashaSummon.updateCompanionInitiative);
            } else {
                Hooks.off('dnd5e.rollInitiative', tashaSummon.updateCompanionInitiative);
            }
        }
    });
    addMenuSetting('Companions Initiative', 'Summons');

    game.settings.register(moduleName, 'Font Change', {
        'name': 'Замена Шрифтов',
        'hint': "Включает альтернативный стиль шрифтов (Geologica). Поддерживает Кириллицу.",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': () => debouncedReload()
    });
    addMenuSetting("Font Change", "User Interface")

    game.settings.register(moduleName, 'Colorize Automated Animations', {
        'name': 'Колоризация иконки модуля Automated Animations',
        'hint': 'Включает перекрашивание иконки модуля Automated Animations в зависимости от настроек.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                automatedAnimations.sortAutoRec();
                Hooks.on('renderItemSheet', automatedAnimations.titleBarButton);
            } else {
                Hooks.off('renderItemSheet', automatedAnimations.titleBarButton);
            }
        }
    });
    addMenuSetting('Colorize Automated Animations', 'User Interface');

    game.settings.register(moduleName, 'Colorize Build A Bonus', {
        'name': 'Колоризация иконки модуля Build A Bonus',
        'hint': 'Включает перекрашивание иконки модуля Build A Bonus в зависимости от настроек.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('renderItemSheet', buildABonus.titleBarButton);
                Hooks.on('renderDAEActiveEffectConfig', buildABonus.daeTitleBarButton);
                Hooks.on('renderActorSheet5e', buildABonus.actorTitleBarButtons);
            } else {
                Hooks.off('renderItemSheet', buildABonus.titleBarButton);
                Hooks.off('renderDAEActiveEffectConfig', buildABonus.daeTitleBarButton);
                Hooks.off('renderActorSheet5e', buildABonus.actorTitleBarButtons);
            }
        }
    });
    addMenuSetting('Colorize Build A Bonus', 'User Interface');

    game.settings.register(moduleName, 'Colorize Dynamic Active Effects', {
        'name': 'Колоризация иконки модуля Dynamic Active Effects',
        'hint': 'Включает перекрашивание иконки модуля Dynamic Active Effects в зависимости от настроек.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('renderItemSheet', colorizeDAETitleBarButton);
            } else {
                Hooks.off('renderItemSheet', colorizeDAETitleBarButton);
            }
        }
    });
    addMenuSetting('Colorize Dynamic Active Effects', 'User Interface');

    game.settings.register(moduleName, 'Colorize Template Macro', {
        'name': 'Колоризация иконки модуля Template Macro',
        'hint': 'Включает перекрашивание иконки модуля Template Macro в зависимости от настроек.',
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('renderItemSheet', templateMacroTitleBarButton);
            } else {
                Hooks.off('renderItemSheet', templateMacroTitleBarButton);
            }
        }
    });
    addMenuSetting('Colorize Template Macro', 'User Interface');

    game.settings.register(moduleName, 'Chat Unloader', {
        'name': 'Разгрузка Чата',
        'hint': "Включает автоматическую выгрузку сообщений из памяти пользователей (снижает нагрузку).",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': () => debouncedReload()
    });
    addMenuSetting("Chat Unloader", "User Interface")

    game.settings.register(moduleName, 'Chat Unloader Limit', {
        'name': 'Разгрузка Чата: Лимит Сообщений',
        'hint': 'Лимит количества сообщений, после которого они будут выгружаться из памяти клиента.',
        'scope': 'world',
        'config': false,
        'type': Number,
        'default': CONFIG.ChatMessage.batchSize,
        'range': {
            'min': CONFIG.ChatMessage.batchSize / 2,
            'max': CONFIG.ChatMessage.batchSize * 5,
            'step': CONFIG.ChatMessage.batchSize / 2
        },
    });
    addMenuSetting('Chat Unloader Limit', 'User Interface');

    game.settings.register(moduleName, 'Rollmode Buttons', {
        'name': 'Селектор режимов броска',
        'hint': "Включает альтернативный селектор режимов броска (кнопки вместо выпадающего списка).",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': () => debouncedReload()
    });
    addMenuSetting("Rollmode Buttons", "User Interface")

    game.settings.register(moduleName, 'Dark Theme', {
        'name': 'Темная Тема',
        'hint': "Включает альтернативную версию UI.",
        'scope': 'world',
        'config': false,
        'type': Boolean,
        'default': false,
        'onChange': () => debouncedReload()
    });
    addMenuSetting("Dark Theme", "User Interface")

    game.settings.registerMenu(moduleName, 'General', {
        'name': 'General',
        'label': 'General',
        'hint': 'Общие настройки модуля.',
        'icon': 'fas fa-gears',
        'type': mbaSettingsGeneral,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Animations', {
        'name': 'Animations',
        'label': 'Animations',
        'hint': 'Настройки автоматизации анимаций.',
        'icon': 'fas fa-film',
        'type': mbaSettingsAnimations,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Class Features', {
        'name': 'Class Features',
        'label': 'Class Features',
        'hint': 'Настройки автоматизации классовых способностей.',
        'icon': 'fas fa-swords',
        'type': mbaSettingsClassFeats,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Feats', {
        'name': 'Feats',
        'label': 'Feats',
        'hint': 'Настройки автоматизации фитов.',
        'icon': 'fas fa-crystal-ball',
        'type': mbaSettingsFeats,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Homebrew', {
        'name': 'Homebrew',
        'label': 'Homebrew',
        'hint': 'Настройки опциональных ХБ способностей/фич.',
        'icon': 'fas fa-cauldron',
        'type': mbaSettingsHomewbrew,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Mechanics', {
        'name': 'Mechanics',
        'label': 'Mechanics',
        'hint': 'Настройки автоматизации механик и QoL штук.',
        'icon': 'fas fa-dice',
        'type': mbaSettingsMechanics,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Monster Features', {
        'name': 'Monster Features',
        'label': 'Monster Features',
        'hint': 'Настройки автоматизации механик и способностей монстров.',
        'icon': 'fas fa-dragon',
        'type': mbaSettingsMonsterFeats,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Race Features', {
        'name': 'Race Features',
        'label': 'Race Features',
        'hint': 'Настройки автоматизации расовых способностей.',
        'icon': 'fas fa-solid fa-nesting-dolls',
        'type': mbaSettingsRaceFeats,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Spells', {
        'name': 'Spells',
        'label': 'Spells',
        'hint': 'Настройки автоматизации заклинаний.',
        'icon': 'fas fa-wand-magic-sparkles',
        'type': mbaSettingsSpells,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'Summons', {
        'name': 'Summons',
        'label': 'Summons',
        'hint': 'Настройки связанные с автоматизацией призыва существ.',
        'icon': 'fas fa-hand-holding-magic',
        'type': mbaSettingsSummons,
        'restricted': true
    });
    game.settings.registerMenu(moduleName, 'User Interface', {
        'name': 'User Interface',
        'label': 'User Interface',
        'hint': 'Настройки интерфейса.',
        'icon': 'fas fa-display',
        'type': mbaSettingsInterface,
        'restricted': false
    });

    game.keybindings.register(moduleName, "modeChange", {
        'name': "Game Master Helper",
        'editable': [{ key: 'KeyQ', modifiers: [KeyboardManager.MODIFIER_KEYS.ALT] }],
        'onDown': () => {
            if(!game.user.isGM) return;
            else macros.gameMasterHelper();
        }
    });
}