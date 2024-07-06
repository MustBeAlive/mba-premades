import {mba} from "../../../helperFunctions.js";

export async function shiveringSickness() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    if (mba.raceOrType(target.actor) != "humanoid") {
        console.log("Target is unaffected by Shivering Sickness (not humanoid)");
        return;
    }
    if (mba.findEffect(target.actor, "Insect Repellent")) { // for later use?
        console.log("Target is protected against Shivering Sickness");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Shivering Sickness!');
        return;
    }
    let shiveringSicknessRoll = await new Roll("2d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(shiveringSicknessRoll);
    const description = [`
        <p>Insects native to the jungles and marshes of Chult carry this disease, shivering sickness. A giant or humanoid that takes damage from insect swarms or from giant centipedes, giant scorpions, or giant wasps is exposed to the disease at the end of the encounter. Those who haven't applied insect repellent since their previous long rest are exposed to the disease when they finish a long rest.</p>
        <p>Creature exposed to the Shivering Sickness must succeed on a DC 11 Constitution saving throw or become infected. A creature with natural armor has advantage on the saving throw. It takes 2d6 hours for symptoms to manifest in an infected creature. Symptoms include blurred vision, disorientation, and a sudden drop in body temperature that causes uncontrollable shivering and chattering of the teeth.</p>
        <p>Once symptoms begin, the infected creature regains only half the normal number of hit points from spending Hit Dice and no hit points from a long rest. The infected creature also has disadvantage on ability checks and attack rolls. At the end of a long rest, an infected creature repeats the saving throw, shaking off the disease on a successful save.</p>
    `];
    async function effectMacroShiveringSicknessManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
        if (!effect) {
            console.log('Unable to find effect (Shivering Sickness)');
            return;
        }
        let hoursToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ hour: hoursToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
            if (!effect) {
                console.log('Unable to find effect (Shivering Sickness)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroShiveringSickness() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                if (!effect) {
                    console.log('Unable to find effect (Shivering Sickness)');
                    return;
                }
                let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total < 11) return;
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `<b>${token.document.name}</b> is cured from <b>Shivering Sickness!</b>`,
                    speaker: { actor: null, alias: "Disease Announcer" }
                });
                await mbaPremades.helpers.removeEffect(effect);
            }
            let number = Math.floor(Math.random() * 10000);
            const effectData = {
                'name': `Unknown Disease ${number}`,
                'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.check.all',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.attack.all',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': mbaPremades.helpers.functionToString(effectMacroShiveringSickness)
                        }
                    },
                    'mba-premades': {
                        'name': "Shivering Sickness",
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
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
                    'script': mba.functionToString(effectMacroShiveringSicknessManifest)
                }
            },
            'mba-premades': {
                'name': "Shivering Sickness",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'roll': shiveringSicknessRoll.total
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><u>${target.document.name}</u> is infected with <b>Shivering Sickness</b></p><p>Symptoms will manifest in <b>${shiveringSicknessRoll.total} hours</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}