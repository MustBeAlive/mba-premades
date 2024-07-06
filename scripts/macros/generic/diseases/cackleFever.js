import {mba} from "../../../helperFunctions.js";
import {constants} from "../constants.js";

export async function cackleFever() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let [isImmune] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever: Immune");
    if (isImmune) {
        ui.notifications.info("Target is immune to the effects of Cackle Fever");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Cackle Fever!');
        return;
    }
    if (mba.raceOrType(target.actor) != "humanoid") {
        ui.notifications.info("Cackle Fever can only affect humanoids!");
        return;
    }
    let cackleFeverRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(cackleFeverRoll);
    const description = [`
        <p>This disease targets humanoids, although gnomes are strangely immune. While in the grips of this disease, victims frequently succumb to fits of mad laughter, giving the disease its common name and its morbid nickname: 'the shrieks'</p>
        <p>Any event that causes the infected creature great stress—including entering combat, taking damage, experiencing fear, or having a nightmare — forces the creature to make a DC 13 Constitution saving throw.</p>
        <p>On a failed save, the creature takes 5 (1d10) psychic damage and becomes incapacitated with mad laughter for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the mad laughter and the incapacitated condition on a success. Any humanoid creature that starts its turn within 10 feet of an infected creature in the throes of mad laughter must succeed on a DC 10 Constitution saving throw or also become infected with the disease. Once a creature succeeds on this save, it is immune to the mad laughter of that particular infected creature for 24 hours.</p>
        <p>At the end of each long rest, an infected creature can make a DC 13 Constitution saving throw. On a successful save, the DC for this save and for the save to avoid an attack of mad laughter drops by 1d6. When the saving throw DC drops to 0, the creature recovers from the disease. A creature that fails three of these saving throws gains a randomly determined form of indefinite madness.</p>
    `];
    async function effectMacroCackleFeverManifest() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
        if (!effect) {
            console.log('Unable to find effect (Cackle Fever)');
            return;
        };
        let hoursToManifest = effect.flags['mba-premades']?.roll;
        await game.Gametime.doIn({ hour: hoursToManifest }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
            if (!effect) {
                console.log('Unable to find effect (Cackle Fever)');
                return;
            };
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroCackleFeverCombatStart() {
                await mbaPremades.macros.diseases.cackleFeverTrigger(actor, token);
            };
            async function effectMacroCackleFeverFrightened() {
                if (!mbaPremades.helpers.findEffect(actor, "Frightened")) return;
                await mbaPremades.macros.diseases.cackleFeverTrigger(actor, token);
            };
            async function effectMacroCackleFeverRest() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
                if (!effect) {
                    console.log('Unable to find effect (Cackle Fever)');
                    return;
                }
                let saveDC = effect.flags['mba-premades']?.saveDC;
                let fails = effect.flags['mba-premades']?.fails;
                let newSaveDC;
                let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
                if (saveRoll.total >= saveDC) {
                    let cackleFeverRoll = await new Roll("1d6").roll({ 'async': true });
                    await MidiQOL.displayDSNForRoll(cackleFeverRoll);
                    newSaveDC = saveDC - cackleFeverRoll.total;
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `
                            <p><b>Cackle Fever: ${token.document.name}</b></p>
                            <p></p>
                            <p>Fails: <b>${fails}</b></p>
                            <p>Old DC: <b>${saveDC}</b></p>
                            <p>Roll Result: <b>${cackleFeverRoll.total}</b></p>
                            <p>New DC: <b>${newSaveDC}</b></p>
                        `,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                };
                if (saveRoll.total < saveDC) {
                    fails += 1;
                    newSaveDC = saveDC;
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `
                            <p><b>Cackle Fever: ${token.document.name}</b></p>
                            <p></p>
                            <p>Fails: <b>${fails}</b></p>
                            <p>Save DC: <b>${newSaveDC}</b></p>
                        `,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                };
                let updates = {
                    'flags': {
                        'mba-premades': {
                            'saveDC': newSaveDC,
                            'fails': fails
                        }
                    }
                };
                await mbaPremades.helpers.updateEffect(effect, updates);
                if (effect.flags['mba-premades']?.fails > 2) {
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<b>${token.document.name}</b> failed the save against <b>Cackle Fever</b> 3 times and gains a randomly determined form of <b>Indefinite Madness</b>!`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await mbaPremades.helpers.removeEffect(effect);
                };
                if (effect.flags['mba-premades']?.saveDC < 1) {
                    ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<b>${token.document.name}</b> is cured from <b>Cackle Fever!</b> (Save DC dropped to 0)`,
                        speaker: { actor: null, alias: "Disease Announcer" }
                    });
                    await mbaPremades.helpers.removeEffect(effect);
                };
            }
            async function effectMacroCackleFeverDel() {
                let [exhaustion] = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                console.log(exhaustion);
                if (!exhaustion) return;
                let level = +exhaustion.name.slice(-1);
                if (level === 1) {
                    await mbaPremades.helpers.removeCondition(actor, "Exhaustion 1");
                    return;
                }
                level -= 1;
                await mbaPremades.helpers.addCondition(actor, "Exhaustion " + level);
            }
            let number = Math.floor(Math.random() * 10000);
            let effectData = {
                'name': `Unknown Disease ${number}`,
                'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
                'changes': [
                    {
                        'key': 'flags.midi-qol.onUseMacroName',
                        'mode': 0,
                        'value': 'function.mbaPremades.macros.diseases.cackleFeverDamaged,isDamaged',
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': mbaPremades.helpers.functionToString(effectMacroCackleFeverRest)
                        },
                        'onCombatStart': {
                            'script': mbaPremades.helpers.functionToString(effectMacroCackleFeverCombatStart)
                        },
                        'onTurnStart': {
                            'script': mbaPremades.helpers.functionToString(effectMacroCackleFeverFrightened)
                        },
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroCackleFeverDel)
                        }
                    },
                    'mba-premades': {
                        'name': "Cackle Fever",
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
                        'saveDC': 13,
                        'fails': 0
                    }
                }
            };
            let exhaustion = token.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
            if (!exhaustion.length) {
                await mbaPremades.helpers.addCondition(actor, "Exhaustion 1");
                await mbaPremades.helpers.createEffect(actor, effectData);
                await mbaPremades.helpers.removeEffect(effect);
                return;
            }
            let level = +exhaustion[0].name.slice(-1);
            level += 1;
            if (level > 6) level = 6;
            await mbaPremades.helpers.addCondition(actor, "Exhaustion " + level);
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
                    'script': mba.functionToString(effectMacroCackleFeverManifest)
                }
            },
            'mba-premades': {
                'name': "Cackle Fever",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'roll': cackleFeverRoll.total,
                'targetUuid': target.document.uuid
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><u>${target.document.name}</u> is infected with <b>Cackle Fever</b></p><p>Symptoms will manifest in <b>${cackleFeverRoll.total} hours</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}

export async function cackleFeverTrigger(actor, token) {
    let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
    if (!effect) {
        console.log('Unable to find effect (Cackle Fever)');
        return;
    }
    if (mba.findEffect(actor, "Incapacitated")) return;
    let saveDC = effect.flags['mba-premades']?.saveDC;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Features', 'Cackle Fever: Mad Laughter', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = saveDC
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Cackle Fever`, object: token })
    }
    let effectData = {
        'name': "Uncontrollable Cackling",
        'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
        'duration': {
            'seconds': 60
        },
        'description': `
            <p>You are incapacitated with mad laughter for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>
        `,
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
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=false, name=Cackle Fever: Mad Laughter, killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(token, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .zIndex(0)
        .persist()
        .name(`${token.document.name} Cackle Fever`)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData);
            if (!mba.findEffect(token.actor, "Prone")) await mba.addCondition(token.actor, 'Prone');
        })

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter1.webp")
        .attachTo(token, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${token.document.name} Cackle Fever`)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter2.webp")
        .attachTo(token, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${token.document.name} Cackle Fever`)

        .effect()
        .from(token)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(token, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 600, ease: "easeOutCubic", pingPong: true })
        .rotate(-90)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .name(`${token.document.name} Cackle Fever`)
        .waitUntilFinished(-200)

        .animation()
        .on(token)
        .opacity(1)

        .play();
}

export async function cackleFeverDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.name === "Cackle Fever: Mad Laughter") return;
    let [infected] = Array.from(workflow.targets).filter(i => i.actor.effects.filter(e => e.flags['mba-premades']?.targetUuid === i.document.uuid && e.flags['mba-premades']?.name === "Cackle Fever"));
    if (!infected) return;
    let [effect] = infected.actor.effects.filter(e => e.flags['mba-premades']?.name === "Cackle Fever");
    if (!effect) {
        console.log('Unable to find effect (Cackle Fever)');
        return;
    }
    if (mba.findEffect(infected.actor, "Incapacitated")) return;
    let saveDC = effect.flags['mba-premades']?.saveDC;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Features', 'Cackle Fever: Mad Laughter', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = saveDC
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': infected.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([infected.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Cackle Fever`, object: token })
    }
    let effectData = {
        'name': "Uncontrollable Cackling",
        'icon': "modules/mba-premades/icons/spells/level1/tasha_hideous_laughter.webp",
        'duration': {
            'seconds': 60
        },
        'description': `
            <p>You are incapacitated with mad laughter for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the mad laughter and the Incapacitated condition on a success.</p>
        `,
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
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=false, name=Cackle Fever: Mad Laughter, killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(infected, { local: true, bindAlpha: false })
        .scaleToObject(2)
        .opacity(1)
        .zIndex(0)
        .persist()
        .name(`${infected.document.name} Cackle Fever`)

        .thenDo(async () => {
            await mba.createEffect(infected.actor, effectData);
            if (!mba.findEffect(infected.actor, "Prone")) await mba.addCondition(infected.actor, 'Prone');
        })

        .animation()
        .on(infected)
        .opacity(0)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter1.webp")
        .attachTo(infected, { offset: { x: 0.4 * infected.document.width, y: -0.45 * infected.document.width }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${infected.document.name} Cackle Fever`)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/laughter2.webp")
        .attachTo(infected, { offset: { x: 0.55 * infected.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 1200, ease: "easeOutCubic" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
        .scaleToObject(0.34)
        .private()
        .persist()
        .name(`${infected.document.name} Cackle Fever`)

        .effect()
        .from(infected)
        .scaleToObject(1, { considerTokenScale: true })
        .attachTo(infected, { bindAlpha: false })
        .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 600, ease: "easeOutCubic", pingPong: true })
        .rotate(-90)
        .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
        .persist()
        .name(`${infected.document.name} Cackle Fever`)
        .waitUntilFinished(-200)

        .animation()
        .on(infected)
        .opacity(1)

        .play();
}

export async function cackleFeverAura(actor, token) {
    if (!mba.inCombat()) return;
    let tokenId = game.combat.current.tokenId;
    let [target] = await mba.findNearby(token, 10, null, false, false).filter(i => i.document.id === tokenId);
    if (!target) return;
    if (mba.checkTrait(target.actor, "ci", "diseased")) return;
    if (mba.findEffect(actor, "Cackle Fever: Immune")) return;
    let saveRoll = await mba.rollRequest(target.actor, 'save', 'con');
    if (saveRoll.total < 10) {
        await mbaPremades.macros.diseases.cackleFever();
        return;
    } else {
        let immuneData = {
            'name': "Cackle Fever: Immune",
            'icon': "modules/mba-premades/icons/conditions/immunity.webp",
            'duration': {
                'seconds': 86400
            },
            'flags': {
                'dae': {
                    'showIcon': false
                }
            }
        };
        await mba.createEffect(target.actor, immuneData);
    }
}