export let mba = {
    'getItemDescription': function _getItemDescription(key, name) {
        let journalEntry = game.journal.getName(key);
        if (!journalEntry) {
            ui.notifications.error('Item descriptions journal entry not found!');
            return;
        }
        let page = journalEntry.pages.getName(name);
        if (!page) {
            ui.notifications.warn('Item description not found in journal!');
            return;
        }
        let description = page.text.content;
        return description;
    },
    'jb2aCheck': function _jb2aCheck() {
        let patreon = game.modules.get('jb2a_patreon')?.active;
        let free = game.modules.get('JB2A_DnD5e')?.active;
        if (patreon && free) {
            ui.notifications.info('Both JB2A Modules are Active Please Disable the Free Version.');
            return 'patreon';
        }
        if (patreon) return 'patreon';
        if (free) return 'free';
        ui.notifications.info('No JB2A Module Active');
        return false;
    },
}