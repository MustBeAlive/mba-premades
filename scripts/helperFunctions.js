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
            ui.notifications.info('Включены обе версии модуля JB2A. Выключи бесплатную.');
            return 'patreon';
        }
        if (patreon) return 'patreon';
        if (free) return 'free';
        ui.notifications.info('Модуль JB2A не включен');
        return false;
    },
    'over30': function _over30 (targets) {
        let tokens = Array.from(targets);
        const distanceArray = [];
        for (let i = 0; i < tokens.length; i++) {
            for (let k = i + 1; k < tokens.length; k++) {
                let token1 = fromUuidSync(tokens[i].document.uuid).object;
                let token2 = fromUuidSync(tokens[k].document.uuid).object;
                distanceArray.push(MidiQOL.computeDistance(token1, token2));
            }
        }
        const found = distanceArray.some((distance) => distance > 30);
        if (found) return 'true';
        if (!found) return 'false';
    }
}