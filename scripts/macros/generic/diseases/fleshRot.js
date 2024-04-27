export async function fleshRot({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Flesh Rot");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Flesh Rot!');
        return;
    }
    const description = [`
        <p>The creature's flesh decays. The creature has disadvantage on Charisma checks and vulnerability to all damage.</p>
    `];
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'system.traits.dv.all',
                'mode': 0,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.cha',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'mba-premades': {
                'name': "Flesh Rot",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Flesh Rot</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}