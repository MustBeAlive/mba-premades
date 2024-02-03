let moduleName = 'mba-premades';
export function registerSettings() {
    game.settings.register('moduleName', 'Check For Updates', {
        name: "Check for Updates",
        hint: "Display a message when update is available",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register('moduleName', 'Check For Something', {
        name: "Check for Something",
        hint: "This is a checkbox. You can check it, or you can leave it be... let it live it's empty life.",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    })
}