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
            .replaceAll('New Content:', '<b><u>New Content:</u></b>')
            .replaceAll('New Monster Content:', '<b><u>New Monster Content:</u></b>')
            .replaceAll('Bug Fixes:', '<b><u>Bug Fixes:</u></b>')
            .replaceAll('Update Notes:', '<b><u>Update Notes:</u></b>')
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