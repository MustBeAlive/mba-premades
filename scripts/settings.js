import { addMenuSetting } from "./settingsMenu";
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
    addMenuSetting('Check For Updates', 'General');
    game.settings.register('moduleName', 'Check For Something', {
        name: "Check for Something",
        hint: "This is a checkbox. You can check it, or you can leave it be... let it live it's empty life.",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    addMenuSetting('Check For Something', 'General');
    game.settings.register(moduleName, 'Add Generic Actions', {
        'name': 'Add Generic Actions',
        'hint': 'When enabled special actions will be added to the actor on token drop.',
        'scope': 'world',
        'config': false,
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
    addMenuSetting('Add Generic Actions', 'General');
}