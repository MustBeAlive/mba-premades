import {mba} from "../../../helperFunctions.js";

export async function seizure() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Seizure");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Seizure!');
        return;
    }
    const description = [`
        <p>The creature is overcome with shaking.</p>
        <p>The creature has disadvantage on Dexterity checks, Dexterity saving throws, and attack rolls that use Dexterity.</p>
    `];
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.dex',
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
                'name': "Seizure",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><u>${target.document.name}</u> is infected with <b>Seizure</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}