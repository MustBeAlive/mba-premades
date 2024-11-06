import {mba} from "../../../helperFunctions.js";

export async function throatLeeches() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Throat Leeches!');
        return;
    }
    let throatLeechesRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(throatLeechesRoll);
    const description = [`
        <p>Minuscule parasites known as throat leeches infect the water in Chult's forests, swamps, and rivers. Any giant or humanoid that swallows tainted water must succeed on a DC 12 Constitution saving throw or be infested with throat leeches. Immediate symptoms include throat inflammation and shortness of breath.</p>
        <p>After 1d6 hours, the infected character gains 1 level of exhaustion that can't be removed (except as described below) until the disease is cured. At the end of each long rest, the infected creature must repeat the saving throw. On a failed save, the creature's exhaustion increases by 1 level; on a successful save, the creature's exhaustion decreases by 1 level. If a successful saving throw reduces the infected creature's level of exhaustion below 1, the creature recovers from the disease.</p>
        <p>Explorers can avoid contracting throat leeches by drinking only rainwater or water that's been boiled or magically purified.</p>
    `];
    async function effectMacroThroatLeechesManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
        if (!effect) {
            console.log('Unable to find effect (Throat Leeches)');
            return;
        }
        let hoursToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ hour: hoursToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
            if (!effect) {
                console.log('Unable to find effect (Throat Leeches)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroThroatLeeches() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
                if (!effect) {
                    console.log('Unable to find effect (Throat Leeches)');
                    return;
                }
                let currentExhaustion = effect.flags['mba-premades']?.currentExhaustion;
                let saveDC = 12;
                let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total < saveDC) {
                    await mbaPremades.helpers.removeCondition(token.actor, `Exhaustion ${currentExhaustion}`);
                    currentExhaustion += 1;
                    if (currentExhaustion > 10) currentExhaustion = 10;
                    await mbaPremades.helpers.addCondition(token.actor, `Exhaustion ${currentExhaustion}`);
                    let updates = {
                        'flags': {
                            'mba-premades': {
                                'currentExhaustion': currentExhaustion
                            }
                        }
                    };
                    await mbaPremades.helpers.updateEffect(effect, updates);
                    return;
                }
                if (saveRoll.total >= saveDC && currentExhaustion > 1) {
                    await mbaPremades.helpers.removeCondition(token.actor, `Exhaustion ${currentExhaustion}`);
                    currentExhaustion -= 1;
                    await mbaPremades.helpers.addCondition(token.actor, `Exhaustion ${currentExhaustion}`);
                    let updates = {
                        'flags': {
                            'mba-premades': {
                                'currentExhaustion': currentExhaustion
                            }
                        }
                    };
                    await mbaPremades.helpers.updateEffect(effect, updates);
                    return;
                }
                if (saveRoll.total >= saveDC && currentExhaustion === 1) {
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<b>${token.document.name}</b> is cured from <b>Throat Leeches!</b>`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await mbaPremades.helpers.removeEffect(effect);
                }
            }
            async function effectMacroThroatLeechesDel() {
                let exhaustion = token.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                if (!exhaustion) return;
                await mbaPremades.helpers.removeCondition(token.actor, exhaustion.name);
            }
            let level;
            let exhaustion = token.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
            if (!exhaustion) {
                await mbaPremades.helpers.addCondition(token.actor, "Exhaustion 1");
                level = 1;
            }
            else {
                level = +exhaustion.name.slice(-1);
                if (level === 0) level = 9;
                level += 1;
                await mbaPremades.helpers.addCondition(token.actor, `Exhaustion ${level}`);
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
                        'dnd5e.longRest': {
                            'script': mbaPremades.helpers.functionToString(effectMacroThroatLeeches)
                        },
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroThroatLeechesDel)
                        }
                    },
                    'mba-premades': {
                        'name': "Throat Leeches",
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
                        'currentExhaustion': level
                    }
                }
            };
            await mbaPremades.helpers.createEffect(token.actor, effectData);
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
                    'script': mba.functionToString(effectMacroThroatLeechesManifest)
                }
            },
            'mba-premades': {
                'name': "Throat Leeches",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'roll': throatLeechesRoll.total
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><u>${target.document.name}</u> is infected with <b>Throat Leeches</b></p><p>Symptoms will manifest in <b>${throatLeechesRoll.total} hours</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}
