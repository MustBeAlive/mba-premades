export async function bluerot({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Bluerot");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Bluerot!');
        return;
    }
    let bluerotRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(bluerotRoll, 'damageRoll');
    const description = [`
        <p>This disease targets humanoids. While afflicted with bluerot, a victim grows grotesque blue boils on their face and back. This disease is carried by undead (including the drowned ones in Tammeraut's Fate), and victims most often acquire it through wounds caused by infected creatures.</p>
        <p>The disease's boils manifest in 1d4 hours, causing the victim's Constitution and Charisma scores to decrease by 1d4 each, to a minimum of 3. This is quickly followed by a fever and tingling in the extremities. An infected creature is vulnerable to radiant damage and gains the ability to breathe underwater.</p>
        <p>At the end of each long rest, an infected creature makes a DC 12 Constitution saving throw. On a success, the victim regains 1 point of Constitution and 1 point of Charisma lost to the disease. If the infected creature regains all the points lost to the disease, it is cured. Other effects that raise the victim's ability scores do not cure the disease.</p>
        <p>On a failed saving throw, the victim takes 18 (4d8) necrotic damage as the boils burst and spread. A creature reduced to 0 hit points by this damage cannot regain hit points until the disease is cured, though it can be stabilized as normal.</p>
    `];
    async function effectMacroBluerotManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Bluerot");
        if (!effect) {
            console.log('Unable to find effect (Bluerot)');
            return;
        }
        let hoursToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ hour: hoursToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Bluerot");
            if (!effect) {
                console.log('Unable to find effect (Bluerot)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            let conRoll = await new Roll("1d4").roll({ 'async': true });
            MidiQOL.displayDSNForRoll(conRoll, 'damageRoll');
            let targetCon = token.actor.system.abilities.con.value;
            let conPenalty = conRoll.total;
            while ((targetCon - conPenalty) < 3 && conPenalty > 0) conPenalty--;
            let chaRoll = await new Roll("1d4").roll({ 'async': true });
            MidiQOL.displayDSNForRoll(chaRoll, 'damageRoll');
            let targetCha = token.actor.system.abilities.cha.value;
            let chaPenalty = chaRoll.total;
            while ((targetCha - chaPenalty) < 3 && chaPenalty > 0) chaPenalty--;
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `<p><b>Bluerot</b> is now affecting <b>${token.document.name}</b></p><p>Constitution Penalty: <b>${conPenalty}</b></p><p>Charisma Penalty: <b>${chaPenalty}</b></p>`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            async function effectMacroBluerot() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Bluerot");
                if (!effect) {
                    console.log('Unable to find effect (Bluerot)');
                    return;
                }
                let conPenalty = effect.flags['mba-premades']?.conPenalty;
                let chaPenalty = effect.flags['mba-premades']?.chaPenalty;
                let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total < 12) {
                    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Features', 'Bluerot: Boil Burst', false);
                    if (!featureData) {
                        ui.notifications.warn(`Unable to find item in the compenidum! (Bluerot: Boil Burst)`);
                        return
                    }
                    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
                    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
                    await MidiQOL.completeItemUse(feature, config, options);
                    if (token.actor.system.attributes.hp.value < 1) {
                        let updates = {
                            'changes': [
                                {
                                    'key': 'system.abilities.con.value',
                                    'mode': 2,
                                    'value': "-" + conPenalty,
                                    'priority': 20
                                },
                                {
                                    'key': 'system.abilities.cha.value',
                                    'mode': 2,
                                    'value': "-" + chaPenalty,
                                    'priority': 20
                                },
                                {
                                    'key': 'system.attributes.death.success',
                                    'mode': 5,
                                    'value': 3,
                                    'priority': 20
                                }
                            ]
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                    }
                    return;
                }
                if (conPenalty >= 1) conPenalty -= 1;
                if (chaPenalty >= 1) chaPenalty -= 1;
                let updates = {
                    'changes': [
                        {
                            'key': 'system.abilities.con.value',
                            'mode': 2,
                            'value': "-" + conPenalty,
                            'priority': 20
                        },
                        {
                            'key': 'system.abilities.cha.value',
                            'mode': 2,
                            'value': "-" + chaPenalty,
                            'priority': 20
                        },
                        {
                            'key': 'system.traits.dv.value',
                            'mode': 2,
                            'value': "radiant",
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'mba-premades': {
                            'conPenalty': conPenalty,
                            'chaPenalty': chaPenalty
                        }
                    }
                };
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `<p><b>Bluerot</b> progress for <b>${token.document.name}</b></p><p>Constitution Penalty: <b>${conPenalty}</b></p><p>Charisma Penalty: <b>${chaPenalty}</b></p>`,
                    speaker: { actor: null, alias: "Disease Announcer" }
                });
                await chrisPremades.helpers.updateEffect(effect, updates);
                if (conPenalty === 0 && chaPenalty === 0) {
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<b>${token.document.name}</b> is cured from <b>Bluerot!</b>`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await chrisPremades.helpers.removeEffect(effect);
                }
            }
            let number = Math.floor(Math.random() * 10000);
            let effectData = {
                'name': `Unknown Disease ${number}`,
                'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
                'changes': [
                    {
                        'key': 'system.abilities.con.value',
                        'mode': 2,
                        'value': "-" + conPenalty,
                        'priority': 20
                    },
                    {
                        'key': 'system.abilities.cha.value',
                        'mode': 2,
                        'value': "-" + chaPenalty,
                        'priority': 20
                    },
                    {
                        'key': 'system.traits.dv.value',
                        'mode': 2,
                        'value': "radiant",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': chrisPremades.helpers.functionToString(effectMacroBluerot)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'name': "Bluerot",
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
                        'conPenalty': conPenalty,
                        'chaPenalty': chaPenalty
                    }
                }
            };
            await chrisPremades.helpers.createEffect(actor, effectData);
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
                    'script': chrisPremades.helpers.functionToString(effectMacroBluerotManifest)
                }
            },
            'mba-premades': {
                'isDisease': true,
                'name': "Bluerot",
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'roll': bluerotRoll.total
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Bluerot</b></p><p>Symptoms will manifest in <b>${bluerotRoll.total} hours</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}