export function registerSettings() {
    game.settings.register('mba-premades', 'Check For Updates', {
        name: "Уведомлять об обновлениях",
        hint: "Если включено, уведомляет ГМа об обновлениях модуля при запуске мира",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register('mba-premades', 'Add Generic Actions', {
        name: "Add Generic Actions",
        hint: "When enabled special actions will be added to the actor on token drop",
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
