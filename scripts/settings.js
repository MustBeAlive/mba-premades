import { cast } from './macros/animations/cast.js';
import { changeChat } from './macros/ui/changeChat.js';
import { corpseHide } from './macros/generic/corpseHide.js';
import { deathSaves } from './macros/mechanics/deathsaves.js';
import { macros } from './macros.js';
import { removeV10EffectsBlind } from './macros/mechanics/blindness.js';
import { removeV10EffectsInvisible } from './macros/mechanics/invisibility.js';
import { tashaSummon } from './macros/generic/tashaSummon.js';

let moduleName = 'mba-premades';

export function registerSettings() {
    game.settings.register(moduleName, 'LastGM', {
        'name': 'LastGM',
        'hint': 'Last GM to join the game.',
        'scope': 'world',
        'config': false,
        'type': String
    });
    game.settings.register(moduleName, 'Dark Chat', {
        'name': 'Включить темную версию чата',
        'hint': "Включает альтернативную (темную) версию чата.",
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            changeChat(value, 'darkChat');
        }
    });
    game.settings.register(moduleName, 'Rollmode Buttons', {
        'name': 'Включить альтернативный селектор режимов броска',
        'hint': "Включить альтернативный селектор режимов броска (кнопки вместо выпадающего списка.",
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
    });
    game.settings.register(moduleName, 'Check For Updates', {
        'name': "Проверять обновления",
        'hint': "Показывать сообщение при входе в мир если доступно обновление модуля",
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false
    });
    game.settings.register(moduleName, 'Blur', {
        'name': 'Blur Automation',
        'hint': 'Включает автоматизацию заклинания Blur через Midi-Qol hooks.',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) {
                Hooks.on('midi-qol.preItemRoll', macros.blur);
            } else {
                Hooks.off('midi-qol.preItemRoll', macros.blur);
            }
        }
    });
    game.settings.register(moduleName, 'Darkness', {
        'name': 'Darkness Automation',
        'hint': 'Включает автоматизацию заклинания Darkness через Midi-Qol hooks.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Death Ward', {
        'name': 'Death Ward Automation',
        'hint': 'Включает автоматизацию заклинания Death Ward через Midi-Qol hooks.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Mirror Image', {
        'name': 'Mirror Image Automation',
        'hint': 'Включает автоматизацию заклинания Mirror Image через Midi-QoL hooks.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Sanctuary', {
        'name': 'Sanctuary Automation',
        'hint': 'Включает автоматизацию заклинания Sanctuary через Midi-QoL hooks.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Show Names', {
        'name': 'Show Names',
        'hint': 'Enabling this will show target names in the target selector dialog (Used for certain features and spells).',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': true
    });
    game.settings.register(moduleName, 'Tasha Actors', {
        'name': 'Keep Summon Actors Updated',
        'hint': 'This setting will keep actors from this module updated in the sidebar.',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
        'onChange': async value => {
            if (value && game.user.isGM) await tashaSummon.setupFolder();
        }
    });
    game.settings.register(moduleName, 'Tasha Initiative', {
        'name': 'Minions use caster\'s initiative',
        'hint': 'Enabling this will have minions summoned from this module to use the caster\'s initiative instead of rolling their own.  Similar to the summon spells from Tasha\'s Cauldron Of Everything',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false
    });
    game.settings.register(moduleName, 'Summons Initiative', {
        'name': 'Auto Update Summons Initiative',
        'hint': 'Automatically update player controlled warpgate summons\' initaitve to be just after the player\'s',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Companions Initiative', {
        'name': 'Auto Update Companions Initiative',
        'hint': 'Automatically update player owned NPCs\' initiative to be just after the player\'s',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Add Generic Actions', {
        'name': "Добавить базовые действия",
        'hint': "Добавляет базовые действия в лист персонажа при дропе токена на карту",
        'scope': 'world',
        'config': true,
        'type': String,
        'default': 'none',
        'choices': {
            'none': 'None',
            'all': 'All Actors',
            'npc': 'All NPC Actors',
            'character': 'All Character Actors',
            'uNpc': 'Unlinked NPC Actors',
            'uCharacter': 'Unlinked Character Actors',
            'lNpc': 'Linked NPC Actors',
            'lCharacter': 'Linked Character Actors'
        }
    });
    game.settings.register(moduleName, 'Blindness Fix', {
        'name': 'Condition: Blinded (Visual Fix)',
        'hint': 'Эта настройка отключает ограничения видимости при получении Condition: Blinded',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) removeV10EffectsBlind();
        }
    });
    game.settings.register(moduleName, 'Invisibility Fix', {
        'name': 'Condition: Invisible (Visual Fix)',
        'hint': 'Эта настройка отключает ограничения видимости при получении Condition: Invisible',
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'default': false,
        'onChange': value => {
            if (value) removeV10EffectsInvisible();
        }
    });
    game.settings.register(moduleName, 'Auto Death Save', {
        'name': 'Auto Death Save Request',
        'hint': 'Эта настройка включает автоматический промт death save\'ов в бою (monk\'s token bar)',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Corpse Hider', {
        'name': 'Corpse Hider',
        'hint': 'Включает автоматическое скрытие трупов для игроков, срабатывает на смене хода в бою.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'Cast Animations', {
        'name': 'Анимации Заклинаний',
        'hint': 'Включает автоматический проигрыш анимаций от JB2A при сотворении любых заклинаний',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'abj_color', {
        'name': 'Abjuration',
        'hint': 'Цвет для заклинаний школы abjuration',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'con_color', {
        'name': 'Conjuration',
        'hint': 'Цвет для заклинаний школы conjuration.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'div_color', {
        'name': 'Divination',
        'hint': 'Цвет для заклинаний школы divination.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'enc_color', {
        'name': 'Enchantment',
        'hint': 'Цвет для заклинаний школы enchantment.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'evo_color', {
        'name': 'Evocation',
        'hint': 'Цвет для заклинаний школы evocation.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'ill_color', {
        'name': 'Illusion',
        'hint': 'Цвет для заклинаний школы illusion.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'nec_color', {
        'name': 'Necromancy',
        'hint': 'Цвет для заклинаний школы necromancy.',
        'scope': 'world',
        'config': true,
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
    game.settings.register(moduleName, 'trs_color', {
        'name': 'Transmutation',
        'hint': 'Цвет для заклинаний школы transmutation.',
        'scope': 'world',
        'config': true,
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
}