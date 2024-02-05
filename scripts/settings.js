import {cast} from './macros/animations/cast.js';
let moduleName = 'mba-premades';
export function registerSettings() {
    game.settings.register(moduleName, 'Check For Updates', {
        name: "Проверять обновления",
        hint: "Показывать сообщение при входе в мир если доступно обновление модуля",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register(moduleName, 'Add Generic Actions', {
        name: "Добавить базовые действия",
        hint: "Добавляет базовые действия в лист персонажа при дропе токена на карту",
        scope: 'world',
        config: true,
        type: String,
        default: 'none',
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
    game.settings.register(moduleName, 'Enable Random Bullshit', {
        name: "Enable Random Bullshit",
        hint: "If enabled, automatically distributes Random Bullshit",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register(moduleName, 'Cast Animations', {
        'name': ' Cast Animations',
        'hint': 'Enable to automatically play JB2A spell cast animations for all spells.',
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
    game.settings.register(moduleName, 'abj_color', {
        'name': 'Abjuration Color',
        'hint': 'Color to use for abjuration spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'con_color', {
        'name': 'Conjuration Color',
        'hint': 'Color to use for conjuration spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'div_color', {
        'name': 'Divination Color',
        'hint': 'Color to use for divination spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'enc_color', {
        'name': 'Enchantment Color',
        'hint': 'Color to use for enchantment spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'evo_color', {
        'name': 'Evocation Color',
        'hint': 'Color to use for evocation spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'ill_color', {
        'name': 'Illusion Color',
        'hint': 'Color to use for illusion spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'nec_color', {
        'name': 'Necromancy Color',
        'hint': 'Color to use for necromancy spells.',
        'scope': 'client',
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
    game.settings.register(moduleName, 'trs_color', {
        'name': 'Transmutation Color',
        'hint': 'Color to use for transmutation spells.',
        'scope': 'client',
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
}
