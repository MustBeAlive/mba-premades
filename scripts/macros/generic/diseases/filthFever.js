import {mba} from "../../../helperFunctions.js";

export async function filthFever() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Filth Fever");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Filth Fever!');
        return;
    }
    const description = [`
        <p>A raging fever sweeps through the creature's body.</p>
        <p>The creature has disadvantage on Strength checks, Strength saving throws, and attack rolls that use Strength.</p>
    `];
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.str',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.str',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.str',
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
                'name': "Filth Fever",
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
        content: `<p><u>${target.document.name}</u> is infected with <b>Filth Fever</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}