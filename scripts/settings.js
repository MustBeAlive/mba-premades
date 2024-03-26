import {cast} from './macros/animations/cast.js';
import {deathSaves} from './macros/mechanics/deathsaves.js';
import {macros} from './macros.js';
import {removeV10EffectsBlind} from './macros/mechanics/blindness.js';
import {removeV10EffectsInvisible} from './macros/mechanics/invisibility.js';
let moduleName = 'mba-premades';
export function registerSettings() {
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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
        'scope': 'client',
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