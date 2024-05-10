import {mba} from "../../../helperFunctions.js";

export async function blueMistFever() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    const [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Blue Mist Fever!');
        return;
    }
    let blueMistFeverRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(blueMistFeverRoll, 'damageRoll');
    const description = [`
        <p>A magical mist creeps through the jungles of Chult. Contact with this thin, blue, odorless mist can infect giants and humanoids with blue mist fever.</p>
        <p>A giant or humanoid that comes into contact with the mist must succeed on a DC 13 Constitution saving throw or become infected with blue mist fever. An infected creature begins seeing vivid hallucinations of blue monkeys 1d6 hours after failing the save, and the hallucinations last until the disease ends on the creature. A creature can repeat the saving throw every 24 hours, ending the effect on itself on a success.</p>
    `];
    async function effectMacroBlueMistFeverManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
        if (!effect) {
            console.log('Unable to find effect (Blue Mist Fever)');
            return;
        }
        let hoursToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ hour: hoursToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
            if (!effect) {
                console.log('Unable to find effect (Blue Mist Fever)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroBlueMistFever() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
                if (!effect) {
                    console.log('Unable to find effect (Blue Mist Fever)');
                    return;
                }
                let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total < 13) return;
                await mbaPremades.helpers.removeEffect(effect);
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `<b>${token.document.name}</b> is cured from <b>Blue Mist Fever!</b>`,
                    speaker: { actor: null, alias: "Disease Announcer" }
                });
            }
            let number = Math.floor(Math.random() * 10000);
            let effectData = {
                'name': `Unknown Disease ${number}`,
                'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': mbaPremades.helpers.functionToString(effectMacroBlueMistFever)
                        }
                    },
                    'mba-premades': {
                        'name': "Blue Mist Fever",
                        'isDisease': true,
                        'lesserRestoraion': true,
                        'greaterRestoration': true,
                        'description': description
                    }
                }
            };
            await mbaPremades.helpers.createEffect(actor, effectData);
            await mbaPremades.helpers.removeEffect(effect);
        });
    }
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroBlueMistFeverManifest)
                }
            },
            'mba-premades': {
                'isDisease': true,
                'name': "Blue Mist Fever",
                'lesserRestoraion': true,
                'greaterRestoration': true,
                'description': description,
                'roll': blueMistFeverRoll.total
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Blue Mist Fever</b></p><p>Symptoms will manifest in <b>${blueMistFeverRoll.total} hours</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}