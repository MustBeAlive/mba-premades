export async function checkUpdate() {
    if (game.messages.contents.find(i => i.flags?.['mba-premades']?.update)) return;
    try {
        let reponse = await fetch('https://api.github.com/repos/mustbealive/mba-premades/releases/latest');
        if (!reponse.ok) return;
        let info = await reponse.json();
        let currentVersion = game.modules.get('mba-premades').version;
        if (currentVersion === '#{VERSION}#') return;
        if (!isNewerVersion(info.tag_name, currentVersion)) return;
        let body = info.body.replaceAll('\r\n\r\n', '<hr>')
            .replaceAll('\r\n', '<br>')
            .replaceAll('### Update Notes:', '<b><u>Update Notes:</u></b>')
            .replaceAll('### Items:', '<b><u>Items:</u></b>')
            .replaceAll('### Cantrip:', '<b><u>Cantrip:</u></b>')
            .replaceAll('### Level 1:', '<b><u>Level 1:</u></b>')
            .replaceAll('### Level 2:', '<b><u>Level 2:</u></b>')
            .replaceAll('### Level 3:', '<b><u>Level 3:</u></b>')
            .replaceAll('### Level 4:', '<b><u>Level 4:</u></b>')
            .replaceAll('### Level 5:', '<b><u>Level 5:</u></b>')
            .replaceAll('### Level 6:', '<b><u>Level 6:</u></b>')
            .replaceAll('### Level 7:', '<b><u>Level 7:</u></b>')
            .replaceAll('### Level 8:', '<b><u>Level 8:</u></b>')
            .replaceAll('### Level 9:', '<b><u>Level 9:</u></b>')
            .replaceAll('### Monsters:', '<b><u>Monsters:</u></b>')
        let message = '<hr>MBA Premades, доступно обновление. Версия: <b>' + info.tag_name + '</b><hr>' + body;
        await ChatMessage.create({
            'speaker': {'alias': name},
            'content': message,
            'whisper': [game.user.id],
            'flags': {
                'mba-premades': {
                    'update': true
                }
            }
        });
    } catch {};
}