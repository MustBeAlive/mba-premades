import {constants} from "../../generic/constants.js";
import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function deathGlareCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, "Frightened")) {
        ui.notifications.warn("Target it not frightened!");
        return false;
    }
}

async function deathGlareItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let currentHP = target.actor.system.attributes.hp.value + target.actor.system.attribute.hp.temp;
    let formula = currentHP.toString();
    let damageRoll = await new Roll(formula).roll({ 'async': true });
    let deathWard = await mba.findEffect(target.actor, "Death Ward");
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.skull")
        .attachTo(target)
        .scaleToObject(1)
        .mask()

        .wait(700)

        .thenDo(async () => {
            if (workflow.failedSaves.size && !deathWard) {
                await mba.applyWorkflowDamage(workflow.token, damageRoll, "none", [target], undefined, workflow.itemCardId);
            }
            else if (workflow.failedSaves.size && deathWard) await mba.removeEffect(deathWard);
        })

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.75 * target.document.texture.scaleX)
        .delay(100)
        .duration(4500)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()
        .playIf(() => {
            return (workflow.failedSaves.size && !deathWard);
        })

        .play()
}

async function horrificAppearanceAuraCombatStart(token, origin) {
    let duplicates = await mba.findNearby(token, 500, "any", true, false).filter(t => t.name === "Sea Hag");
    // what the fuck is this...
    if (duplicates.length) {
        let delayRoll1 = await new Roll("1d10").roll({ 'async': true });
        let delayRoll2 = await new Roll("1d10").roll({ 'async': true });
        let delayRoll3 = await new Roll("1d10").roll({ 'async': true });
        let delay1 = delayRoll1.total * 100;
        let delay2 = delayRoll2.total * 100;
        let delay3 = delayRoll3.total * 100;
        await warpgate.wait(delay1);
        await warpgate.wait(delay2);
        await warpgate.wait(delay3);
    }
    async function effectMacroDel() {
        await mbaPremades.macros.monsters.seaHag.horrificAppearanceAuraEnd(token);
    };
    let effectData = {
        'name': "Sea Hag: Horrific Appearance Aura",
        'icon': "modules/mba-premades/icons/generic/horrific_appearance.webp",
        'origin': origin.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.name',
                'mode': 5,
                'value': "seaHagHorrificAppearance",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.range',
                'mode': 5,
                'value': "30",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.disposition',
                'mode': 5,
                'value': "all",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.effectName',
                'mode': 5,
                'value': "Sea Hag: Horrific Appearance",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.macroName',
                'mode': 5,
                'value': "seaHagHorrificAppearance",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.conscious',
                'mode': 5,
                'value': "true",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.seaHagHorrificAppearance.spellDC',
                'mode': 5,
                'value': 14,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP', 'combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let flagAuras = {
        'seaHagHorrificAppearance': {
            'name': 'seaHagHorrificAppearance',
            'range': 30,
            'disposition': 'all',
            'effectName': 'Sea Hag: Horrific Appearance',
            'macroName': 'seaHagHorrificAppearance',
            'conscious': true,
            'spellDC': 11
        }
    };
    await mba.createEffect(token.actor, effectData);
    effectAuras.add(flagAuras, token.document.uuid, true);
}

async function horrificAppearanceAura(token, selectedAura) {
    if (token.name === "Sea Hag") return;
    if (mba.raceOrType(token.actor) != "humanoid") return;
    if (mba.findEffect(token.actor, "Sea Hag: Horrific Appearance Immune")) return;
    if (mba.findEffect(token.actor, "Sea Hag: Horrific Appearance")) return;
    if (mba.findEffect(token.actor, "Sea Hag: Fear")) return;
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Sea Hag: Horrific Appearance Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.seaHag.horrificAppearanceAuraTurnStart(token);
    }
    let effectData = {
        'name': "Sea Hag: Horrific Appearance",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>At the start of your next turn, you will be subjected to Sea Hag's Horrific Appearance.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'aura': true,
                'effect': {
                    'noAnimation': true
                },
                'originUuid': selectedAura.tokenUuid
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function horrificAppearanceAuraTurnStart(token) {
    if (mba.raceOrType(token.actor) != "humanoid") return;
    if (mba.findEffect(token.actor, "Blinded")) return;
    if (mba.findEffect(token.actor, "Sea Hag: Horrific Appearance Immune")) return;
    if (mba.findEffect(token.actor, "Sea Hag: Fear")) return;
    let effect = await mba.findEffect(token.actor, "Sea Hag: Horrific Appearance");
    let seaHagDoc = await fromUuid(effect.flags['mba-premades']?.originUuid);
    let seaHagToken = seaHagDoc.object;
    let choices = [["Avert Eyes (Disadvantage on Attack Rolls against Hag)", "avert"], ["Embrace Horrific Appearance (Saving Throw)", "save"]];
    let selection = await mba.dialog("Sea Hag: Horrific Appearance", choices, `<p>You are about to be affected by </p><p><u>Sea Hag's Horrific Appearance</u></p><p>What would you like to do?</p>`);
    if (!selection || mba.findEffect(token.actor, "Surprised")) selection = "save";
    if (selection === "avert") {
        const effectDataAvert = {
            'name': "Sea Hag: Avert Eyes",
            'icon': "modules/mba-premades/icons/conditions/avert_eyes.webp",
            'description': `
                <p>You averted your eyes to escape the effect of Sea Hag's Horrific Appearance.</p>
                <p>While your eyes are averted, you have diasdvantage on all attack rolls against the Hag.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.monsters.seaHag.horrificAppearanceAvertEyes,preAttackRoll',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStart', 'combatEnd', 'zeroHP']
                }
            }
        };
        if (!mba.findEffect(token.actor, "Sea Hag: Avert Eyes")) await mba.createEffect(token.actor, effectDataAvert);
        return;
    }
    else if (selection === "save") {
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Sea Hag: Horrific Appearance", false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': seaHagDoc.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(seaHagToken)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(seaHagToken)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .opacity(1)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.02")
            .atLocation(seaHagToken)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(seaHagToken)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.5)
            .rotate(90)
            .rotateTowards(token)
            .belowTokens()
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
            .atLocation(seaHagToken)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.2)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .rotate(90)
            .rotateTowards(token)
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("jb2a.wind_stream.white")
            .atLocation(seaHagToken)
            .stretchTo(token, { onlyX: false })
            .filter("Blur", { blurX: 10, blurY: 20 })
            .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 100, pingPong: true })
            .opacity(0.3)

            .effect()
            .from(token)
            .attachTo(token)
            .fadeIn(100)
            .fadeOut(1000)
            .playbackRate(4)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
            .scaleToObject(1, { considerTokenScale: true })
            .duration(5000)
            .opacity(0.15)
            .zIndex(0.1)

            .play()

        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) {
            const immuneData = {
                'name': "Sea Hag: Horrific Appearance Immune",
                'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
                'description': `
                    <p>You are immune to Sea Hag's Horrific Appearance for the next 24 hours.</p>
                `,
                'duration': {
                    'seconds': 86400
                },
            };
            await mba.createEffect(token.actor, immuneData);
            let auraEffect = await mba.findEffect(token.actor, "Sea Hag: Horrific Appearance");
            if (auraEffect) await mba.removeEffect(auraEffect);
            return;
        }
        else if (featureWorkflow.failedSaves.size) {
            async function effectMacroTurnEnd() {
                await mbaPremades.macros.monsters.seaHag.horrificAppearanceAuraTurnEnd(token);
            };
            async function effectMacroDel() {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} SHFear` })
            };
            const effectData = {
                'name': "Sea Hag: Fear",
                'icon': "modules/mba-premades/icons/generic/gaze_frightening.webp",
                'description': `
                    <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Sea Hag's Horrific Appearance.</p>
                    <p>You can repeat the saving throw at the end of each of your turns, with disadvantage if the hag is within line of sight, ending the effect on a success.</p>
                `,
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Frightened",
                        'priority': 20
                    },
                ],
                'flags': {
                    'dae': {
                        'specialDuration': ['combatEnd']
                    },
                    'effectmacro': {
                        'onTurnEnd': {
                            'script': mba.functionToString(effectMacroTurnEnd)
                        },
                        'onDelete': {
                            'script': mba.functionToString(effectMacroDel)
                        }
                    },
                    'mba-premades': {
                        'feature': {
                            'seaHag': {
                                'horrificAppearance': {
                                    'originUuid': seaHagDoc.uuid
                                }
                            }
                        }
                    }
                }
            };
            new Sequence()

                .effect()
                .file("jb2a.toll_the_dead.purple.skull_smoke")
                .atLocation(token)
                .scaleToObject(2.5, { considerTokenScale: true })
                .opacity(0.9)
                .playbackRate(0.5)

                .effect()
                .file("jb2a.template_circle.symbol.normal.fear.dark_purple")
                .attachTo(token)
                .scaleToObject(1.6)
                .fadeIn(2000)
                .fadeOut(1000)
                .mask()
                .persist()
                .name(`${token.document.name} SHFear`)

                .thenDo(async () => {
                    await mba.createEffect(token.actor, effectData);
                })

                .play()
        }
    }
}

async function horrificAppearanceAvertEyes({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let targets = Array.from(workflow.targets).filter(i => i.document.name === "Sea Hag");
    if (!targets.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'avertEyes', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS:Averted Eyes");
    queue.remove(workflow.item.uuid);
}

async function horrificAppearanceAuraTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Sea Hag: Fear");
    if (!effect) return;
    let originUuid = effect.flags['mba-premades']?.feature?.seaHag?.horrificAppearance?.originUuid;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Sea Hag: Horrific Appearance", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Sea Hag Fear: Save (DC11)";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let [hagNearby] = await mba.findNearby(token, 200, "any", false, false, false, true).filter(t => t.document.uuid === originUuid);
    if (hagNearby) await mba.createEffect(token.actor, constants.disadvantageEffectData);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    else if (!featureWorkflow.failedSaves.size) {
        const immuneData = {
            'name': "Sea Hag: Horrific Appearance Immune",
            'icon': "modules/mba-premades/icons/generic/gaze_frightening_immunity.webp",
            'description': `
                <p>You are immune to Sea Hag's Horrific Appearance for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            },
        };
        await mba.removeEffect(effect);
        await mba.createEffect(token.actor, immuneData);
        let auraEffect = await mba.findEffect(token.actor, "Sea Hag: Horrific Appearance");
        if (auraEffect) await mba.removeEffect(auraEffect);
    }
}

async function horrificAppearanceAuraEnd(token) {
    effectAuras.remove('seaHagHorrificAppearance', token.document.uuid);
}

export let seaHag = {
    'deathGlareCast': deathGlareCast,
    'deathGlareItem': deathGlareItem,
    'horrificAppearanceAuraCombatStart': horrificAppearanceAuraCombatStart,
    'horrificAppearanceAura': horrificAppearanceAura,
    'horrificAppearanceAuraTurnStart': horrificAppearanceAuraTurnStart,
    'horrificAppearanceAvertEyes': horrificAppearanceAvertEyes,
    'horrificAppearanceAuraTurnEnd': horrificAppearanceAuraTurnEnd,
    'horrificAppearanceAuraEnd': horrificAppearanceAuraEnd
}