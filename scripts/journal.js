let welcomeText = `<p>Как же я пытаюсь избавится от этого правового костыля с журналом — кто бы знал, ей богу. Проще в колено себе выстрелить, чем разобраться в этом всем. Эх.</p>`;
export async function setupJournalEntry() {
    let journalName = 'MBA - Descriptions';
    let journalEntry = game.journal.getName(journalName);
    if (!journalEntry) {
        journalEntry = await JournalEntry.create({
            'name': journalName,
            'pages': [
                {
                    'sort': 100000,
                    'name': 'Info',
                    'type': 'text',
                    'title': {
                        'show': true,
                        'level': 1
                    },
                    'text': {
                        'format': 1,
                        'content': welcomeText,
                        'markdown': ''
                    }
                }
            ],
            'ownership': {
                'default': 2
            }
        });
    } else {
        let page = journalEntry.pages.getName('Info');
        if (page) {
            await page.update({
                'text.content': welcomeText
            });
        }
    }
    async function addPage(journalEntry, pageName, text) {
        await JournalEntryPage.create({
            'name': pageName, 
            'text': {'content': text}, 
            'title': {'show': false, 'level': 1}, 
            'sort': journalEntry.pages.contents.at(-1).sort + CONST.SORT_INTEGER_DENSITY
        }, 
        {
            'parent': journalEntry
        });
    }
    async function checkPage(journalEntry, name) {
        if (!journalEntry.pages.getName(name)) await addPage(journalEntry, name, '');
    }
    async function preparePages(journalEntry, packKey) {
        let gamePack = game.packs.get(packKey);
        if (!gamePack) {
            ui.notifications.error('Compendium was not loaded! Journal entries could not be updated.');
            return;
        }
        let packItems = await gamePack.getDocuments();
        for (let i of packItems) {
            if (i.name === '#[CF_tempEntity]') continue;
            await checkPage(journalEntry, i.name);
        }
    }
    await preparePages(journalEntry, 'mba-premades.MBA Actions');
    await preparePages(journalEntry, 'mba-premades.MBA Spells');
}