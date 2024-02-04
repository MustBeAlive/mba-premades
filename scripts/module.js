Hooks.once('init', () => {
    registerSettings();
});

Hooks.once('ready', () => {
    if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate();
});
