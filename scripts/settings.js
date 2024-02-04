function registerSettings() {
    game.settings.register('mba-premades', 'Check For Updates', {
        name: "Check For Updates",
        hint: "If enabled, automatically checks for available updates",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
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
