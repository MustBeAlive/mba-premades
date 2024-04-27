export async function sewerPlague({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Sewer Plague!');
        return;
    }
    let sewerPlagueRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(sewerPlagueRoll, 'damageRoll');
    const description = [`
        <p>Sewer plague is a generic term for a broad category of illnesses that incubate in sewers, refuse heaps, and stagnant swamps, and which are sometimes transmitted by creatures that dwell in those areas, such as rats and otyughs.</p>
        <p>When a humanoid creature is bitten by a creature that carries the disease, or when it comes into contact with filth or offal contaminated by the disease, the creature must succeed on a DC 11 Constitution saving throw or become infected.</p>
        <p>It takes 1d4 days for sewer plague's symptoms to manifest in an infected creature. Symptoms include fatigue and cramps. The infected creature suffers one level of exhaustion, and it regains only half the normal number of hit points from spending Hit Dice and no hit points from finishing a long rest.</p>
        <p>At the end of each long rest, an infected creature must make a DC 11 Constitution saving throw. On a failed save, the character gains one level of exhaustion.</p><p>On a successful save, the character's exhaustion level decreases by one level. If a successful saving throw reduces the infected creature's level of exhaustion below 1, the creature recovers from the disease.</p>
    `];
    async function effectMacroSewerPlagueManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
        if (!effect) {
            console.log('Unable to find effect (Sewer Plague)');
            return;
        }
        let daysToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ day: daysToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
            if (!effect) {
                console.log('Unable to find effect (Sewer Plague)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroSewerPlague() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                if (!effect) {
                    console.log('Unable to find effect (Sewer Plague)');
                    return;
                }
                let currentExhaustion = effect.flags['mba-premades']?.currentExhaustion;
                let saveDC = 11;
                let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total < 11) {
                    await chrisPremades.helpers.removeCondition(token.actor, "Exhaustion " + currentExhaustion);
                    currentExhaustion += 1;
                    if (currentExhaustion > 6) currentExhaustion = 6; // temp workaround
                    await chrisPremades.helpers.addCondition(token.actor, "Exhaustion " + currentExhaustion);
                    let updates = {
                        'flags': {
                            'mba-premades': {
                                'currentExhaustion': currentExhaustion
                            }
                        }
                    };
                    await chrisPremades.helpers.updateEffect(effect, updates);
                    return;
                }
                if (saveRoll.total >= saveDC && currentExhaustion > 1) {
                    await chrisPremades.helpers.removeCondition(token.actor, "Exhaustion " + currentExhaustion);
                    currentExhaustion -= 1;
                    await chrisPremades.helpers.addCondition(token.actor, "Exhaustion " + currentExhaustion);
                    let updates = {
                        'flags': {
                            'mba-premades': {
                                'currentExhaustion': currentExhaustion
                            }
                        }
                    };
                    await chrisPremades.helpers.updateEffect(effect, updates);
                    return;
                }
                if (saveRoll.total >= saveDC && currentExhaustion === 1) {
                    await chrisPremades.helpers.removeEffect(effect);
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<b>${token.document.name}</b> is cured from <b>Sewer Plague!</b>`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                }
            }
            async function effectMacroSewerPlagueDel() {
                let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                if (!exhaustion.length) return
                await chrisPremades.helpers.removeEffect(exhaustion[0]);
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
                            'script': chrisPremades.helpers.functionToString(effectMacroSewerPlague)
                        },
                        'onDelete': {
                            'script': chrisPremades.helpers.functionToString(effectMacroSewerPlagueDel)
                        }
                    },
                    'mba-premades': {
                        'name': "Sewer Plague",
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
                        'currentExhaustion': 1
                    }
                }
            };
            await chrisPremades.helpers.addCondition(token.actor, "Exhaustion 1");
            await chrisPremades.helpers.createEffect(token.actor, effectData);
            await chrisPremades.helpers.removeEffect(effect);
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
                    'script': chrisPremades.helpers.functionToString(effectMacroSewerPlagueManifest)
                }
            },
            'mba-premades': {
                'name': "Sewer Plague",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'roll': sewerPlagueRoll.total
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Sewer Plague</b></p><p>Symptoms will manifest in <b>${sewerPlagueRoll.total}</b> days</p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}