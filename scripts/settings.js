export function registerSettings() {
    game.settings.register('mba-premades', 'Check For Updates', {
        name: "Проверять обновления",
        hint: "Показывать сообщение при входе в мир если доступно обновление модуля",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register('mba-premades', 'Add Generic Actions', {
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
    game.settings.register('mba-premades', 'Enable Random Bullshit', {
        name: "Enable Random Bullshit",
        hint: "If enabled, automatically distributes Random Bullshit",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
}
