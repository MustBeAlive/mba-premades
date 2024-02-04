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
    }
}