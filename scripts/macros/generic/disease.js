async function creator({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(game.user.targets);
    if (!targets.length) {
        ui.notifications.warn('No target selected!');
        return;
    }
    let targetActor = targets[0].actor;
    let choices = [
        ['Arcane Blight (RotF)', 'arcane_blight'],
        ['Blinding Sickness (PHB)', 'blinding_sickness'],
        ['Blue Mist Fever (ToA)', 'blue_mist_fever'],
        ['Blue Rot (GoS)', 'blue_rot'],
        ['Cackle Fever (DMG)', 'cackle_fever'],
        ['Filth Fever (PHB)', 'filth_fever'],
        ['Flesh Rot (PHB)', 'flesh_rot'],
        ['Mindfire (PHB)', 'mindfire'],
        ['Seizure (PHB)', 'seizure'],
        ['Sewer Plague (DMG)', 'sewer_plague'],
        ['Shivering Sickness (ToA)', 'shivering_sickness'],
        ['Sight Rot (DMG)', 'sight_rot'],
        ['Slimy Doom (PHB)', 'slimy_doom'],
        ['Throat Leeches (ToA)', 'throat_leeches']
    ]
    let selection = await chrisPremades.helpers.dialog('Choose Disease to apply:', choices);
    if (!selection) return;
    let isDiseased;
    let description = [];
    let effectData;
    switch (selection) {
        //Done, not tested
        case "arcane_blight": {
            let arcaneBlightImmune = await chrisPremades.helpers.findEffect(targetActor, "Arcane Blight Immunity");
            if (arcaneBlightImmune) {
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: "<b>" + targets[0].document.name + "</b> is immune to Arcane Blight!",
                    speaker: { actor: null, alias: "Disease Announcer" }
                });
                return;
            }
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Arcane Blight");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Arcane Blight!');
                return;
            }
            description.push([
                `
                <p>Any humanoid that spends 12 hours in the necropolis must succeed on a DC 15 Constitution saving throw or contract an arcane blight. This magical disease transforms the humanoid into a nothic, but only after the victim experiences hallucinations and feelings of isolation and paranoia. Other symptoms include clammy skin, hair loss, and myopia (nearsightedness).</p>
                <p>A player character infected with the arcane blight gains the following flaw: 'I don't trust anyone.' This flaw, which supersedes any conflicting flaw, is fed by delusions that are difficult for the character to distinguish from reality. Common delusions include the belief that that allies are conspiring to steal the victim's riches or otherwise turn against the victim.</p>
                <p>Whenever it finishes a long rest, an infected humanoid must repeat the saving throw. On a successful save, the DC for future saves against the arcane blight drops by 1d6. If the saving throw DC drops to 0, the creature overcomes the arcane blight and becomes immune to the effect of further exposure. A creature that fails three of these saving throws transforms into a nothic under the DM's control. Only a wish spell or divine intervention can undo this transformation.</p>
                <p>A greater restoration spell or similar magic ends the infection on the target, removing the flaw and all other symptoms, but this magic doesn't protect the target against further exposure.</p>
                `
            ]);
            async function effectMacroArcaneBlight() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Arcane Blight");
                if (!effects.length) {
                    console.log('Unable to find effect (Arcane Blight)');
                    return;
                }
                let effect = effects[0];
                let saveDC = effect.flags['mba-premades']?.saveDC;
                let fails = effect.flags['mba-premades']?.fails;
                let newSaveDC;
                let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total >= saveDC) {
                    let arcaneBlightRoll = await new Roll("1d6").roll({ 'async': true });
                    await MidiQOL.displayDSNForRoll(arcaneBlightRoll, 'damageRoll');
                    newSaveDC = saveDC - arcaneBlightRoll.total;
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `
                            <p><b>Arcane Blight: ` + token.document.name + `</b></p>
                            <p></p>
                            <p>Fails: <b>${fails}</b></p>
                            <p>Old DC: <b>${saveDC}</b></p>
                            <p>Roll Result: <b>${arcaneBlightRoll.total}</b></p>
                            <p>New DC: <b>${newSaveDC}</b></p>
                        `,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                }
                if (saveRoll.total < saveDC) {
                    fails += 1;
                    newSaveDC = saveDC;
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `
                            <p><b>Arcane Blight: ` + token.document.name + `</b></p>
                            <p></p>
                            <p>Fails: <b>${fails}</b></p>
                            <p>Save DC: <b>${newSaveDC}</b></p>
                        `,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                }
                let updates = {
                    'flags': {
                        'mba-premades': {
                            'saveDC': newSaveDC,
                            'fails': fails
                        }
                    }
                };
                await chrisPremades.helpers.updateEffect(effect, updates);
                if (effect.flags['mba-premades']?.fails > 2) {
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: "<b>" + targets[0].document.name + "</b> failed the save against Arcane Blight three times and turned into Nothic!",
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await chrisPremades.helpers.removeEffect(effect);
                }
                if (effect.flags['mba-premades']?.saveDC < 1) {
                    let immuneData = {
                        'name': "Arcane Blight Immunity",
                        'flags': {
                            'dae': {
                                'showIcon': false
                            }
                        }
                    };
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: "<b>" + token.document.name + "</b> is cured from Arcane Blight! (Save DC dropped to 0)",
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await chrisPremades.helpers.removeEffect(effect);
                    await chrisPremades.helpers.createEffect(actor, immuneData);
                }
            }
            effectData = {
                'name': "Unknown Disease 1",
                'changes': [
                    {
                        'key': 'system.details.flaw',
                        'mode': 2,
                        'value': "I don't trust anyone.",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': chrisPremades.helpers.functionToString(effectMacroArcaneBlight)
                        }
                    },
                    'mba-premades': {
                        'name': "Arcane Blight",
                        'isDisease': true,
                        'lesserResoration': false,
                        'greaterRestoration': true,
                        'description': description,
                        'saveDC': 15,
                        'fails': 0
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "blinding_sickness": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Blinding Sickness");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Blinding Sickness!');
                return;
            }
            description.push([
                `
                <p>Pain grips the creature's mind, and its eyes turn milky white. The creature has disadvantage on Wisdom checks and Wisdom saving throws and is blinded.</p>
                `
            ]);
            effectData = {
                'name': "Unknown Disease 2",
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
                        'name': "Blinding Sickness",
                        'isDisease': true,
                        'lesserResoration': true,
                        'greaterRestoration': true,
                        'description': description
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "blue_mist_fever": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Blue Mist Fever!');
                return;
            }
            let blueMistFeverRoll = await new Roll("1d6").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(blueMistFeverRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Blue Mist Fever. Symptoms will manifest in ${blueMistFeverRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>A magical mist creeps through the jungles of Chult. Contact with this thin, blue, odorless mist can infect giants and humanoids with blue mist fever.</p>
                <p>A giant or humanoid that comes into contact with the mist must succeed on a DC 13 Constitution saving throw or become infected with blue mist fever. An infected creature begins seeing vivid hallucinations of blue monkeys 1d6 hours after failing the save, and the hallucinations last until the disease ends on the creature. A creature can repeat the saving throw every 24 hours, ending the effect on itself on a success.</p>
                `
            ]);
            async function effectMacroBlueMistFeverManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
                if (!effects.length) {
                    console.log('Unable to find effect (Blue Mist Fever)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
                    if (!effects.length) {
                        console.log('Unable to find effect (Blue Mist Fever)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroBlueMistFever() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Mist Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Blue Mist Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < 13) return;
                        await chrisPremades.helpers.removeEffect(effect);
                    }
                    let effectData = {
                        'name': "Unknown Disease 3",
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroBlueMistFever)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoraion': true,
                                'greaterRestoration': true,
                                'name': "Blue Mist Fever",
                                'description': description
                            }
                        }
                    };
                    await chrisPremades.helpers.createEffect(actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 3",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroBlueMistFeverManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoraion': true,
                        'greaterRestoration': true,
                        'name': "Blue Mist Fever",
                        'description': description,
                        'roll': blueMistFeverRoll.total
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "blue_rot": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Rot");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Blue Rot!');
                return;
            }
            let blueRotRoll = await new Roll("1d4").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(blueRotRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Blue Rot. Symptoms will manifest in ${blueRotRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>This disease targets humanoids. While afflicted with bluerot, a victim grows grotesque blue boils on their face and back. This disease is carried by undead (including the drowned ones in Tammeraut's Fate), and victims most often acquire it through wounds caused by infected creatures.</p>
                <p>The disease's boils manifest in 1d4 hours, causing the victim's Constitution and Charisma scores to decrease by 1d4 each, to a minimum of 3. This is quickly followed by a fever and tingling in the extremities. An infected creature is vulnerable to radiant damage and gains the ability to breathe underwater.</p>
                <p>At the end of each long rest, an infected creature makes a DC 12 Constitution saving throw. On a success, the victim regains 1 point of Constitution and 1 point of Charisma lost to the disease. If the infected creature regains all the points lost to the disease, it is cured. Other effects that raise the victim's ability scores do not cure the disease.</p>
                <p>On a failed saving throw, the victim takes 18 (4d8) necrotic damage as the boils burst and spread. A creature reduced to 0 hit points by this damage cannot regain hit points until the disease is cured, though it can be stabilized as normal.</p>
                `
            ]);
            async function effectMacroBlueRotManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Rot");
                if (!effects.length) {
                    console.log('Unable to find effect (Blue Rot)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Rot");
                    if (!effects.length) {
                        console.log('Unable to find effect (Blue Rot)');
                        return;
                    }
                    let effect = effects[0];
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
                        content: `<p><b>Blue Rot</b> is now affecting <b>${token.document.name}</b></p><p>Constitution Penalty: <b>${conPenalty}</b></p><p>Charisma Penalty: <b>${chaPenalty}</b></p>`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    async function effectMacroBlueRot() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Blue Rot");
                        if (!effects.length) {
                            console.log('Unable to find effect (Blue Rot)');
                            return;
                        }
                        let effect = effects[0];
                        let conPenalty = effect.flags['mba-premades']?.conPenalty;
                        let chaPenalty = effect.flags['mba-premades']?.chaPenalty;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < 12) {
                            let blueRotDamageRoll = await new Roll("4d8[necrotic]").roll({ 'async': true });
                            await MidiQOL.displayDSNForRoll(blueRotDamageRoll, 'damageRoll');
                            blueRotDamageRoll.toMessage({
                                rollMode: 'roll',
                                speaker: { 'alias': name },
                                flavor: `<b>Blue Rot</b>`
                            });
                            await chrisPremades.helpers.applyDamage(actor, blueRotDamageRoll.total, 'necrotic');
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
                            content: `<p><b>Blue Rot</b> progress for <b>${token.document.name}</b></p><p>Constitution Penalty: <b>${conPenalty}</b></p><p>Charisma Penalty: <b>${chaPenalty}</b></p>`,
                            speaker: { actor: null, alias: "Disease Announcer" }
                        });
                        await chrisPremades.helpers.updateEffect(effect, updates);
                        if (conPenalty === 0 && chaPenalty === 0) await chrisPremades.helpers.removeEffect(effect);
                    }
                    effectData = {
                        'name': "Unknown Disease 4",
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
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroBlueRot)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Blue Rot",
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
            effectData = {
                'name': "Unknown Disease 4",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroBlueRotManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Blue Rot",
                        'description': description,
                        'roll': blueRotRoll.total
                    }
                }
            };
            break;
        }
        //Partially done; needs testing; does not spread the disease when triggered in 10ft; add animation from tasha's hideous laughter;
        case "cackle_fever": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Cackle Fever!');
                return;
            }
            let cackleFeverRoll = await new Roll("1d4").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(cackleFeverRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Cackle Fever. Symptoms will manifest in ${cackleFeverRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>This disease targets humanoids, although gnomes are strangely immune. While in the grips of this disease, victims frequently succumb to fits of mad laughter, giving the disease its common name and its morbid nickname: 'the shrieks'</p>
                <p>Any event that causes the infected creature great stress—including entering combat, taking damage, experiencing fear, or having a nightmare — forces the creature to make a DC 13 Constitution saving throw.</p>
                <p>On a failed save, the creature takes 5 (1d10) psychic damage and becomes incapacitated with mad laughter for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the mad laughter and the incapacitated condition on a success. Any humanoid creature that starts its turn within 10 feet of an infected creature in the throes of mad laughter must succeed on a DC 10 Constitution saving throw or also become infected with the disease. Once a creature succeeds on this save, it is immune to the mad laughter of that particular infected creature for 24 hours.</p>
                <p>At the end of each long rest, an infected creature can make a DC 13 Constitution saving throw. On a successful save, the DC for this save and for the save to avoid an attack of mad laughter drops by 1d6. When the saving throw DC drops to 0, the creature recovers from the disease. A creature that fails three of these saving throws gains a randomly determined form of indefinite madness.</p>
                `
            ]);
            async function effectMacroCackleFeverManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                if (!effects.length) {
                    console.log('Unable to find effect (Cackle Fever)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                    if (!effects.length) {
                        console.log('Unable to find effect (Cackle Fever)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroCackleFeverCombatStart() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
                        if (isIncapacitated) return;
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) return;
                        let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
                        await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
                        cackleFeverDamageRoll.toMessage({
                            rollMode: 'roll',
                            speaker: { 'alias': name },
                            flavor: `<b>Cackle Fever</b>`
                        });
                        await chrisPremades.helpers.applyDamage(token, cackleFeverDamageRoll.total, 'psychic');
                        let effectData = {
                            'name': "Uncontrollable Cackling",
                            'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
                            'duration': {
                                'seconds': 60
                            },
                            'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
                            'changes': [
                                {
                                    'key': 'macro.CE',
                                    'mode': 0,
                                    'value': 'Incapacitated',
                                    'priority': 20
                                },
                                {
                                    'key': 'flags.midi-qol.OverTime',
                                    'mode': 0,
                                    'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                                    'priority': 20
                                }
                            ],

                        };
                        await chrisPremades.helpers.createEffect(actor, effectData);
                    }
                    async function effectMacroCackleFeverFrightened() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let isFrightened = await chrisPremades.helpers.findEffect(actor, "Frightened");
                        if (!isFrightened) return;
                        let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
                        if (isIncapacitated) return;
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) return;
                        let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
                        await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
                        cackleFeverDamageRoll.toMessage({
                            rollMode: 'roll',
                            speaker: { 'alias': name },
                            flavor: `<b>Cackle Fever</b>`
                        });
                        await chrisPremades.helpers.applyDamage(token, cackleFeverDamageRoll.total, 'psychic');
                        let effectData = {
                            'name': "Uncontrollable Cackling",
                            'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
                            'duration': {
                                'seconds': 60
                            },
                            'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
                            'changes': [
                                {
                                    'key': 'macro.CE',
                                    'mode': 0,
                                    'value': 'Incapacitated',
                                    'priority': 20
                                },
                                {
                                    'key': 'flags.midi-qol.OverTime',
                                    'mode': 0,
                                    'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                                    'priority': 20
                                }
                            ],

                        };
                        await chrisPremades.helpers.createEffect(actor, effectData);
                    }
                    async function effectMacroCackleFeverRest() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                        if (!effects.length) {
                            console.log('Unable to find effect (Cackle Fever)');
                            return;
                        }
                        let effect = effects[0];
                        let saveDC = effect.flags['mba-premades']?.saveDC;
                        let fails = effect.flags['mba-premades']?.fails;
                        let newSaveDC;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total >= saveDC) {
                            let cackleFeverRoll = await new Roll("1d6").roll({ 'async': true });
                            await MidiQOL.displayDSNForRoll(cackleFeverRoll, 'damageRoll');
                            newSaveDC = saveDC - cackleFeverRoll.total;
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: `
                                    <p><b>Cackle Fever: ` + token.document.name + `</b></p>
                                    <p></p>
                                    <p>Fails: <b>${fails}</b></p>
                                    <p>Old DC: <b>${saveDC}</b></p>
                                    <p>Roll Result: <b>${cackleFeverRoll.total}</b></p>
                                    <p>New DC: <b>${newSaveDC}</b></p>
                                `,
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                        }
                        if (saveRoll.total < saveDC) {
                            fails += 1;
                            newSaveDC = saveDC;
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: `
                                    <p><b>Cackle Fever: ` + token.document.name + `</b></p>
                                    <p></p>
                                    <p>Fails: <b>${fails}</b></p>
                                    <p>Save DC: <b>${newSaveDC}</b></p>
                                `,
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                        }
                        let updates = {
                            'flags': {
                                'mba-premades': {
                                    'saveDC': newSaveDC,
                                    'fails': fails
                                }
                            }
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                        if (effect.flags['mba-premades']?.fails > 2) {
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: "<b>" + targets[0].document.name + "</b> failed the save against Cackle Fever 3 times and gains a randomly determined form of <b>Indefinite Madness!</b>",
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                            await chrisPremades.helpers.removeEffect(effect);
                        }
                        if (effect.flags['mba-premades']?.saveDC < 1) {
                            ChatMessage.create({
                                whisper: ChatMessage.getWhisperRecipients("GM"),
                                content: "<b>" + token.document.name + "</b> is cured from Cackle Fever! (Save DC dropped to 0)",
                                speaker: { actor: null, alias: "Disease Announcer" }
                            });
                            await chrisPremades.helpers.removeEffect(effect);
                        }
                    }
                    async function effectMacroCackleFeverDel() {
                        let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                        let level = +exhaustion[0].name.slice(-1);
                        if (level === 1) {
                            await chrisPremades.helpers.removeCondition(actor, "Exhaustion 1");
                            return;
                        }
                        level -= 1;
                        await chrisPremades.helpers.addCondition(actor, "Exhaustion " + level);
                    }
                    effectData = {
                        'name': "Unknown Disease 5",
                        'changes': [
                            {
                                'key': 'flags.midi-qol.onUseMacroName',
                                'mode': 0,
                                'value': 'function.mbaPremades.macros.disease.cackleFeverDamaged,isDamaged',
                                'priority': 20
                            }
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverRest)
                                },
                                'onCombatStart': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverCombatStart)
                                },
                                'onTurnStart': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverFrightened)
                                },
                                'onDelete': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverDel)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Cackle Fever",
                                'description': description,
                                'saveDC': 13,
                                'fails': 0
                            }
                        }
                    };
                    let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                    if (!exhaustion.length) {
                        await chrisPremades.helpers.addCondition(actor, "Exhaustion 1");
                        await chrisPremades.helpers.createEffect(actor, effectData);
                        await chrisPremades.helpers.removeEffect(effect);
                        return;
                    }
                    let level = +exhaustion[0].name.slice(-1);
                    level += 1;
                    if (level > 6) level = 6;
                    await chrisPremades.helpers.addCondition(actor, "Exhaustion " + level);
                    await chrisPremades.helpers.createEffect(actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 5",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroCackleFeverManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Cackle Fever",
                        'description': description,
                        'roll': cackleFeverRoll.total,
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "filth_fever": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Filth Fever");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Filth Fever!');
                return;
            }
            description.push([
                `
                <p>A raging fever sweeps through the creature's body.</p>
                <p>The creature has disadvantage on Strength checks, Strength saving throws, and attack rolls that use Strength.</p>
                `
            ]);
            effectData = {
                'name': "Unknown Disease 6",
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
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Filth Fever",
                        'description': description
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "flesh_rot": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Flesh Rot");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Flesh Rot!');
                return;
            }
            description.push([
                `
                <p>The creature's flesh decays. The creature has disadvantage on Charisma checks and vulnerability to all damage.</p>
                `
            ]);
            effectData = {
                'name': "Unknown Disease 7",
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
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Flesh Rot",
                        'description': description
                    }
                }
            };
            break;
        }
        //Done, not tested; automovement is commented
        case "mindfire": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Mindfire");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Mindfire!');
                return;
            }
            description.push([
                `
                <p>The creature's mind becomes feverish.</p>
                <p>The creature has disadvantage on Intelligence checks and Intelligence saving throws, and the creature behaves as if under the effects of the confusion spell during combat.</p>
                `
            ]);
            async function effectMacroMindfire() {
                await chrisPremades.helpers.addCondition(actor, "Reaction");
                let mindfireRoll = await new Roll("1d10").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(mindfireRoll, 'damageRoll');
                if (mindfireRoll.total === 1) {
                    let directionRoll = await new Roll("1d8").roll({ 'async': true });
                    await MidiQOL.displayDSNForRoll(directionRoll, 'damageRoll');
                    const directionResult = directionRoll.total;
                    const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
                    const directionContent = directions[directionResult - 1];
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p>Direction roll: <b>${directionRoll.total}</b></p><p><b>${token.document.name}</b> uses all its movement to move in ${directionContent} direction</p>`,
                        speaker: { actor: token.actor }
                    });
                    /*
                    const walkSpeedFeet = token.actor.system.attributes.movement.walk;
                    const gridDistance = canvas.dimensions.distance; // Feet per grid cell
                    const pixelsPerFoot = canvas.scene.grid.size / gridDistance;
                    const moveDistancePixels = walkSpeedFeet * pixelsPerFoot;
                    const diagonalMultiplier = Math.SQRT2;
                    let moveX = 0;
                    let moveY = 0;
    
                    switch (directionContent) {
                        case "North":
                            moveY = -moveDistancePixels;
                            break;
                        case "South":
                            moveY = moveDistancePixels;
                            break;
                        case "East":
                            moveX = moveDistancePixels;
                            break;
                        case "West":
                            moveX = -moveDistancePixels;
                            break;
                        case "North-West":
                            moveX = -moveDistancePixels / diagonalMultiplier;
                            moveY = -moveDistancePixels / diagonalMultiplier;
                            break;
                        case "North-East":
                            moveX = moveDistancePixels / diagonalMultiplier;
                            moveY = -moveDistancePixels / diagonalMultiplier;
                            break;
                        case "South-West":
                            moveX = -moveDistancePixels / diagonalMultiplier;
                            moveY = moveDistancePixels / diagonalMultiplier;
                            break;
                        case "South-Eeast":
                            moveX = moveDistancePixels / diagonalMultiplier;
                            moveY = moveDistancePixels / diagonalMultiplier;
                            break;
                    }
                    const newX = token.x + moveX;
                    const newY = token.y + moveY;
                    let endPoint = new PIXI.Point(newX, newY);
                    let collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(token.center, endPoint, { type: "move", mode: "any" });
                    if (!collisionDetected) {
                        await token.document.update({ x: newX, y: newY });
                        content1 = `The movement roll for ${token.actor.name} is ${directionResult}: ${token.actor.name} moves ${directionContent} using all (${token.actor.system.attributes.movement.walk} feet) of their movement. The creature doesn't take an action this turn.`
                    }
                    else {
                        // Calculate the direction vector based on the intended direction
                        let directionVector = { x: moveX, y: moveY };
                        let magnitude = Math.hypot(directionVector.x, directionVector.y);
                        // Normalize the direction vector
                        directionVector.x /= magnitude;
                        directionVector.y /= magnitude;
    
                        // Calculate the number of steps based on the total intended movement distance
                        let totalSteps = moveDistancePixels / (canvas.scene.grid.size / 10);
                        let collisionDetected = false;
                        let stepCounter = 0;
    
                        for (let step = 1; step <= totalSteps; step++) {
                            // Calculate the next step's potential position
                            let nextX = token.x + directionVector.x * (canvas.scene.grid.size / 10) * step;
                            let nextY = token.y + directionVector.y * (canvas.scene.grid.size / 10) * step;
                            let nextPoint = new PIXI.Point(nextX, nextY);
    
                            // Check for collision at this next step
                            collisionDetected = CONFIG.Canvas.polygonBackends.move.testCollision(token.center, nextPoint, { type: "move", mode: "any" });
    
                            if (collisionDetected) {
                                break; // Stop moving further if a collision is detected
                            }
                            stepCounter = step; // Update the step counter to the last successful step without a collision
                        }
    
                        // Calculate the final position to move the token to, based on the last step without a collision
                        let finalX = token.x + directionVector.x * (canvas.scene.grid.size / 10) * stepCounter;
                        let finalY = token.y + directionVector.y * (canvas.scene.grid.size / 10) * stepCounter;
    
                        let distanceMovedInFeet = (stepCounter * (canvas.scene.grid.size / 10)) / pixelsPerFoot;
    
                        if (stepCounter > 0) { // Ensure there was at least one step without collision
                            await token.document.update({ x: finalX, y: finalY });
                            content1 = `The movement roll for ${token.actor.name} is ${directionResult}: ${token.actor.name} moves ${directionContent} using ${distanceMovedInFeet} feet of their movement before hitting an obstacle. The creature doesn't take an action this turn.`
                        } else {
                            content1 = `The movement for ${token.actor.name} does not occur because the way is blocked. The creature doesn't take an action this turn.`
                        }
                    }
                    */
                }
                else if (mindfireRoll.total < 7) {
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn.</p>`,
                        speaker: { actor: token.actor }
                    });
                }
                else if (mindfireRoll.total < 9) {
                    const rangeCheck = MidiQOL.findNearby(null, token, token.actor.system.attributes.movement.walk, { includeToken: false });
                    if (rangeCheck.length > 0) {
                        const randomSelection = rangeCheck[Math.floor(Math.random() * rangeCheck.length)];
                        let target = randomSelection;
                        ChatMessage.create({
                            content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> must move to <b>${randomSelection.actor.name}</b> and attack them with a melee attack.</p>`,
                            speaker: { actor: token.actor }
                        });
                        new Sequence()

                            .effect()
                            .from(target)
                            .belowTokens()
                            .attachTo(target, { locale: true })
                            .scaleToObject(1, { considerTokenScale: true })
                            .spriteRotation(target.rotation * -1)
                            .filter("Glow", { color: 0x911a1a, distance: 20 })
                            .duration(17500)
                            .fadeIn(1000, { delay: 1000 })
                            .fadeOut(3500, { ease: "easeInSine" })
                            .opacity(0.75)
                            .zIndex(0.1)
                            .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.25], duration: 1500, pingPong: true, delay: 500 })

                            .effect()
                            .file("jb2a.extras.tmfx.outflow.circle.01")
                            .attachTo(target, { locale: true })
                            .scaleToObject(1.5, { considerTokenScale: false })
                            .randomRotation()
                            .duration(17500)
                            .fadeIn(4000)
                            .fadeOut(3500, { ease: "easeInSine" })
                            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                            .tint(0x870101)
                            .opacity(0.5)
                            .belowTokens()
                            .play()
                    }
                    else {
                        ChatMessage.create({
                            content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>`,
                            speaker: { actor: token.actor }
                        });
                    }
                }
                else {
                    ChatMessage.create({
                        content: `<p>Roll result: <b>${mindfireRoll.total}</b></p><p><b>${token.document.name}</b> can act normally.</p>`,
                        speaker: { actor: token.actor }
                    });
                }
            }
            effectData = {
                'name': "Unknown Disease 8",
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.check.int',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.save.int',
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
                        'onTurnStart': {
                            'script': chrisPremades.helpers.functionToString(effectMacroMindfire)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Mindfire",
                        'description': description
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "seizure": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Seizure");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Seizure!');
                return;
            }
            description.push([
                `
                <p>The creature is overcome with shaking.</p>
                <p>The creature has disadvantage on Dexterity checks, Dexterity saving throws, and attack rolls that use Dexterity.</p>
                `
            ]);
            effectData = {
                'name': "Unknown Disease 9",
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
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Seizure",
                        'description': description
                    }
                }
            };
            break;
        }
        //Partially done: doesn't cut the long rest regen and doesn't account for half regen from hit die rolls; update when Exhaustion AE can be 6+
        case "sewer_plague": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Sewer Plague!');
                return;
            }
            let sewerPlagueRoll = await new Roll("1d4").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(sewerPlagueRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Sewer Plague. Symptoms will manifest in ${sewerPlagueRoll.total} days.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>Sewer plague is a generic term for a broad category of illnesses that incubate in sewers, refuse heaps, and stagnant swamps, and which are sometimes transmitted by creatures that dwell in those areas, such as rats and otyughs.</p>
                <p>When a humanoid creature is bitten by a creature that carries the disease, or when it comes into contact with filth or offal contaminated by the disease, the creature must succeed on a DC 11 Constitution saving throw or become infected.</p>
                <p>It takes 1d4 days for sewer plague's symptoms to manifest in an infected creature. Symptoms include fatigue and cramps. The infected creature suffers one level of exhaustion, and it regains only half the normal number of hit points from spending Hit Dice and no hit points from finishing a long rest.</p>
                <p>At the end of each long rest, an infected creature must make a DC 11 Constitution saving throw. On a failed save, the character gains one level of exhaustion.</p><p>On a successful save, the character's exhaustion level decreases by one level. If a successful saving throw reduces the infected creature's level of exhaustion below 1, the creature recovers from the disease.</p>
                `
            ]);
            async function effectMacroSewerPlagueManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                if (!effects.length) {
                    console.log('Unable to find effect (Sewer Plague)');
                    return;
                }
                let daysToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ days: daysToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                    if (!effects.length) {
                        console.log('Unable to find effect (Sewer Plague)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroSewerPlague() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sewer Plague");
                        if (!effects.length) {
                            console.log('Unable to find effect (Sewer Plague)');
                            return;
                        }
                        let effect = effects[0];
                        let currentExhaustion = effect.flags['mba-premades']?.currentExhaustion;
                        let saveDC = 11;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < saveDC) {
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
                        if (saveRoll.total >= saveDC && currentExhaustion === 1) await chrisPremades.helpers.removeEffect(effect);
                    }
                    async function effectMacroSewerPlagueDel() {
                        let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                        if (!exhaustion.length) return
                        await chrisPremades.helpers.removeEffect(exhaustion[0]);
                    }
                    let effectData = {
                        'name': "Unknown Disease 10",
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
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Sewer Plague",
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
            effectData = {
                'name': "Unknown Disease 10",
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
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Sewer Plague",
                        'description': description,
                        'roll': sewerPlagueRoll.total
                    }
                }
            };
            break;
        }
        //Partially done: doesn't cut the long rest regen and doesn't account for half regen from hit die rolls;
        case "shivering_sickness": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Shivering Sickness!');
                return;
            }
            let shiveringSicknessRoll = await new Roll("2d6").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(shiveringSicknessRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Shivering Sickness. Symptoms will manifest in ${shiveringSicknessRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>Insects native to the jungles and marshes of Chult carry this disease, shivering sickness. A giant or humanoid that takes damage from insect swarms or from giant centipedes, giant scorpions, or giant wasps is exposed to the disease at the end of the encounter. Those who haven't applied insect repellent since their previous long rest are exposed to the disease when they finish a long rest.</p>
                <p>Creature exposed to the Shivering Sickness must succeed on a DC 11 Constitution saving throw or become infected. A creature with natural armor has advantage on the saving throw. It takes 2d6 hours for symptoms to manifest in an infected creature. Symptoms include blurred vision, disorientation, and a sudden drop in body temperature that causes uncontrollable shivering and chattering of the teeth.</p>
                <p>Once symptoms begin, the infected creature regains only half the normal number of hit points from spending Hit Dice and no hit points from a long rest. The infected creature also has disadvantage on ability checks and attack rolls. At the end of a long rest, an infected creature repeats the saving throw, shaking off the disease on a successful save.</p>
                `
            ]);
            async function effectMacroShiveringSicknessManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                if (!effects.length) {
                    console.log('Unable to find effect (Shivering Sickness)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                    if (!effects.length) {
                        console.log('Unable to find effect (Shivering Sickness)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroShiveringSickness() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Shivering Sickness");
                        if (!effects.length) {
                            console.log('Unable to find effect (Shivering Sickness)');
                            return;
                        }
                        let effect = effects[0];
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < 11) return;
                        await chrisPremades.helpers.removeEffect(effect);
                    }
                    let effectData = {
                        'name': "Unknown Disease 11",
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
                                    'script': chrisPremades.helpers.functionToString(effectMacroShiveringSickness)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Shivering Sickness",
                                'description': description,
                            }
                        }
                    };
                    await chrisPremades.helpers.createEffect(actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 11",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroShiveringSicknessManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Shivering Sickness",
                        'description': description,
                        'roll': shiveringSicknessRoll.total
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "sight_rot": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Sight Rot!');
                return;
            }
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Sight Rot. Symptoms will manifest in 1 day.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                <p>This painful infection causes bleeding from the eyes and eventually blinds the victim.</p>
                <p>A beast or humanoid that drinks water tainted by sight rot must succeed on a DC 15 Constitution saving throw or become infected. One day after infection, the creature's vision starts to become blurry. The creature takes a -1 penalty to attack rolls and ability checks that rely on sight. At the end of each long rest after the symptoms appear, the penalty worsens by 1. When it reaches -5, the victim is blinded until its sight is restored by magic such as lesser restoration or heal.</p>
                <p>Sight rot can be cured using a rare flower called <b>Eyebright</b>, which grows in some swamps. Given an hour, a character who has proficiency with an herbalism kit can turn the flower into one dose of ointment. Applied to the eyes before a long rest, one dose of it prevents the disease from worsening after that rest. After three doses, the ointment cures the disease entirely.</p>
                `
            ]);
            async function effectMacroSightRotManifest() {
                await game.Gametime.doIn({ days: 1 }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
                    if (!effects.length) {
                        console.log('Unable to find effect (Sight Rot)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroSightRot() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
                        if (!effects.length) {
                            console.log('Unable to find effect (Sight Rot)');
                            return;
                        }
                        let effect = effects[0];
                        let currentPenalty = effect.flags['mba-premades']?.penalty;
                        let eyebrightCurrent = effect.flags['mba-premades']?.eyebrightCurrent;
                        let eyebrightLast = effect.flags['mba-premades']?.eyebrightLast;
                        if (eyebrightCurrent > eyebrightLast && eyebrightCurrent != 3) {
                            eyebrightLast = eyebrightCurrent;
                            let updates = {
                                'flags': {
                                    'mba-premades': {
                                        'eyebrightLast': eyebrightLast,
                                        'eyebrightUsed': false
                                    }
                                }
                            };
                            await chrisPremades.helpers.updateEffect(effect, updates);
                            return;
                        }
                        if (eyebrightCurrent > eyebrightLast && eyebrightCurrent === 3) {
                            await chrisPremades.helpers.removeEffect(effect);
                            return;
                        }
                        currentPenalty += 1;
                        if (currentPenalty > 5) currentPenalty = 5;
                        let updates = {
                            'changes': [
                                {
                                    'key': 'system.bonuses.All-Attacks',
                                    'mode': 2,
                                    'value': "-" + currentPenalty,
                                    'priority': 20
                                },
                                {
                                    'key': 'system.skills.prc.bonuses.check',
                                    'mode': 2,
                                    'value': "-" + currentPenalty,
                                    'priority': 20
                                },
                                {
                                    'key': 'system.skills.inv.bonuses.check',
                                    'mode': 2,
                                    'value': "-" + currentPenalty,
                                    'priority': 20
                                }
                            ],
                            'flags': {
                                'mba-premades': {
                                    'penalty': currentPenalty,
                                    'eyebrightCurrent': 0,
                                    'eyebrightLast': 0
                                }
                            }
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                        if (currentPenalty === 5 && !chrisPremades.helpers.findEffect(actor, 'Blinded')) await chrisPremades.helpers.addCondition(actor, "Blinded");
                    }
                    async function effectMacroSightRotDel() {
                        let effect = chrisPremades.helpers.findEffect(actor, "Blinded");
                        if (effect) await chrisPremades.helpers.removeEffect(effect);
                    }
                    let effectData = {
                        'name': "Unknown Disease 12",
                        'changes': [
                            {
                                'key': 'system.bonuses.All-Attacks',
                                'mode': 2,
                                'value': "-1",
                                'priority': 20
                            },
                            {
                                'key': 'system.skills.prc.bonuses.check',
                                'mode': 2,
                                'value': "-1",
                                'priority': 20
                            },
                            {
                                'key': 'system.skills.inv.bonuses.check',
                                'mode': 2,
                                'value': "-1",
                                'priority': 20
                            }
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroSightRot)
                                },
                                'onDelete': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroSightRotDel)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Sight Rot",
                                'description': description,
                                'penalty': 1,
                                'eyebrightCurrent': 0,
                                'eyebrightLast': 0,
                                'eyebrightUsed': false
                            }
                        }
                    };
                    await chrisPremades.helpers.createEffect(token.actor, effectData);
                    await chrisPremades.helpers.removeEffect(effect);
                });
            }
            effectData = {
                'name': "Unknown Disease 12",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroSightRotManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Sight Rot",
                        'description': description
                    }
                }
            };
            break;
        }
        //Done, not tested
        case "slimy_doom": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Slimy Doom");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Slimy Doom!');
                return;
            }
            description.push([
                `
                <p>The creature begins to bleed uncontrollably.</p>
                <p>The creature has disadvantage on Constitution checks and Constitution saving throws.</p>
                <p>In addition, whenever the creature takes damage, it is stunned until the end of its next turn.</p>
                `
            ]);
            effectData = {
                'name': "Unknown Disease 13",
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.check.con',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.save.con',
                        'mode': 2,
                        'value': 1,
                        'priority': 20
                    },
                    {
                        'key': 'flags.midi-qol.onUseMacroName',
                        'mode': 0,
                        'value': 'function.mbaPremades.macros.disease.slimyDoom,isDamaged',
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Slimy Doom",
                        'description': description
                    }
                }
            };
            break;
        }
        //Partially done, not tested; update when Exhaustion AE can be 6+
        case "throat_leeches": {
            isDiseased = targets[0].actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
            if (isDiseased.length) {
                ui.notifications.info('Target is already affected by Throat Leeches!');
                return;
            }
            let throatLeechesRoll = await new Roll("1d6").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(throatLeechesRoll, 'damageRoll');
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: targets[0].document.name + ` is infected with Throat Leeches. Symptoms will manifest in ${throatLeechesRoll.total} hours.`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            description.push([
                `
                    <p>Minuscule parasites known as throat leeches infect the water in Chult's forests, swamps, and rivers. Any giant or humanoid that swallows tainted water must succeed on a DC 12 Constitution saving throw or be infested with throat leeches. Immediate symptoms include throat inflammation and shortness of breath.</p>
                    <p>After 1d6 hours, the infected character gains 1 level of exhaustion that can't be removed (except as described below) until the disease is cured. At the end of each long rest, the infected creature must repeat the saving throw. On a failed save, the creature's exhaustion increases by 1 level; on a successful save, the creature's exhaustion decreases by 1 level. If a successful saving throw reduces the infected creature's level of exhaustion below 1, the creature recovers from the disease.</p>
                    <p>Explorers can avoid contracting throat leeches by drinking only rainwater or water that's been boiled or magically purified.</p>
                `
            ]);
            async function effectMacroThroatLeechesManifest() {
                let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
                if (!effects.length) {
                    console.log('Unable to find effect (Throat Leeches)');
                    return;
                }
                let hoursToManifest = effects[0].flags['mba-premades']?.roll;
                await game.Gametime.doIn({ hours: hoursToManifest }, async () => {
                    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
                    if (!effects.length) {
                        console.log('Unable to find effect (Throat Leeches)');
                        return;
                    }
                    let effect = effects[0];
                    let description = effect.flags['mba-premades']?.description;
                    async function effectMacroThroatLeeches() {
                        let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Throat Leeches");
                        if (!effects.length) {
                            console.log('Unable to find effect (Throat Leeches)');
                            return;
                        }
                        let effect = effects[0];
                        let currentExhaustion = effect.flags['mba-premades']?.currentExhaustion;
                        let saveDC = 12;
                        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                        if (saveRoll.total < saveDC) {
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
                        if (saveRoll.total >= saveDC && currentExhaustion === 1) await chrisPremades.helpers.removeEffect(effect);
                    }
                    async function effectMacroThroatLeechesDel() {
                        let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                        if (!exhaustion.length) return
                        await chrisPremades.helpers.removeEffect(exhaustion[0]);
                    }
                    let effectData = {
                        'name': "Unknown Disease 14",
                        'flags': {
                            'dae': {
                                'showIcon': false
                            },
                            'effectmacro': {
                                'dnd5e.longRest': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroThroatLeeches)
                                },
                                'onDelete': {
                                    'script': chrisPremades.helpers.functionToString(effectMacroThroatLeechesDel)
                                }
                            },
                            'mba-premades': {
                                'isDisease': true,
                                'lesserRestoration': true,
                                'greaterRestoration': true,
                                'name': "Throat Leeches",
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
            effectData = {
                'name': "Unknown Disease 14",
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroThroatLeechesManifest)
                        }
                    },
                    'mba-premades': {
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'name': "Throat Leeches",
                        'description': description,
                        'roll': throatLeechesRoll.total
                    }
                }
            };
            break;
        }
    }
    await chrisPremades.helpers.createEffect(targetActor, effectData);
}

async function cackleFeverDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effects = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
    if (!effects.length) {
        console.log('Unable to find effect (Cackle Fever)');
        return;
    }
    let effect = effects[0];
    let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
    if (isIncapacitated) return;
    let saveDC = effect.flags['mba-premades']?.saveDC;
    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
    if (saveRoll.total >= saveDC) return;
    let cackleFeverDamageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(cackleFeverDamageRoll, 'damageRoll');
    cackleFeverDamageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: `<b>Cackle Fever</b>`
    });
    let damageTotal = cackleFeverDamageRoll.total;
    workflow.damageItem.damageDetail[0].push({ 'damage': damageTotal });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
    let effectData = {
        'name': "Uncontrollable Cackling",
        'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
        'duration': {
            'seconds': 60
        },
        'description': `<p>You are incapacitated with mad laughter for the duration.</p><p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>`,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=' + saveDC + ', saveMagic=false, name=Cackle Fever',
                'priority': 20
            }
        ],

    };
    await chrisPremades.helpers.createEffect(actor, effectData);
}

async function sightRotEyebrightOintment({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
    if (!effects.length) {
        console.log('Unable to find effect (Sight Rot)');
        return;
    }
    let effect = effects[0];
    let eyebrightUsed = effect.flags['mba-premades']?.eyebrightUsed;
    if (eyebrightUsed === true) return;
    let eyebrightCurrent = effect.flags['mba-premades']?.eyebrightCurrent;
    eyebrightCurrent += 1;
    let updates = {
        'flags': {
            'mba-premades': {
                'eyebrightCurrent': eyebrightCurrent,
                'eyebrightUsed': true
            }
        }
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function slimyDoom({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectData = {
        'name': "Unknown Disease Stun",
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Stunned",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

export let disease = {
    'creator': creator,
    'cackleFeverDamaged': cackleFeverDamaged,
    'sightRotEyebrightOintment': sightRotEyebrightOintment,
    'slimyDoom': slimyDoom
}