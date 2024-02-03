Hooks.once('init', async function() {
    registerSettings();
});

Hooks.once('ready', async function() {
    if (game.settings.get('mba-premades', 'Check For Updates')) checkUpdate()
});
