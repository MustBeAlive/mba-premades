export async function blindingSickness({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blinding Sickness");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Blinding Sickness!');
        return;
    }
    const description = [`
        <p>Pain grips the creature's mind, and its eyes turn milky white. The creature has disadvantage on Wisdom checks and Wisdom saving throws and is blinded.</p>
    `];
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.wis',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.wis',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'mba-premades': {
                'isDisease': true,
                'name': "Blinding Sickness",
                'lesserResoration': true,
                'greaterRestoration': true,
                'description': description
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Blinding Sickness</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}