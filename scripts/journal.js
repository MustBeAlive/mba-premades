let welcomeText = `<p>Any item, spell, or feature that is added to your sheet temporarily needs a description. Module updates will replace the compendiums they're stored in, so instead the descriptions will be pulled from this journal entry. All pages after this one will not get regenerated when updating this module.</p>`;
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
        let message = '<hr>View MBA Premades readme here: @UUID[JournalEntry.' + journalEntry.id + ']{Read Me}';
        ChatMessage.create({
            'speaker': {'alias': 'MBA Premades'},
            'content': message
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
    await preparePages(journalEntry, 'mba-premades.MBA Features');
    await preparePages(journalEntry, 'mba-premades.MBA Items');
    await preparePages(journalEntry, 'mba-premades.MBA Spells');
}