import {constants} from "../../generic/constants.js";
import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function petrifyingGazeAuraCombatStart(token, origin) {
    let duplicates = await mba.findNearby(token, 500, "any", true, false).filter(t => t.name === "Medusa");
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
        await mbaPremades.macros.monsters.medusa.petrifyingGazeAuraEnd(token);
    };
    let effectData = {
        'name': "Medusa: Petrifying Gaze Aura",
        'icon': "modules/mba-premades/icons/generic/gaze_petrification.webp",
        'origin': origin.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.name',
                'mode': 5,
                'value': "medusaPetrifyingGazeAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.range',
                'mode': 5,
                'value': "30",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.disposition',
                'mode': 5,
                'value': "all",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.effectName',
                'mode': 5,
                'value': "Medusa: Petrifying Gaze",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.macroName',
                'mode': 5,
                'value': "medusaPetrifyingGazeAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.conscious',
                'mode': 5,
                'value': "true",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.medusaPetrifyingGazeAura.spellDC',
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
        'medusaPetrifyingGazeAura': {
            'name': 'medusaPetrifyingGazeAura',
            'range': 30,
            'disposition': 'all',
            'effectName': 'Medusa: Petrifying Gaze',
            'macroName': 'medusaPetrifyingGazeAura',
            'conscious': true,
            'spellDC': 14
        }
    };
    await mba.createEffect(token.actor, effectData);
    effectAuras.add(flagAuras, token.document.uuid, true);
}

async function petrifyingGazeAura(token, selectedAura) {
    if (token.name === "Medusa") return;
    if (mba.findEffect(token.actor, "Medusa: Petrifying Gaze")) return;
    if (mba.findEffect(token.actor, "Medusa: Petrification")) return;
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Medusa: Petrifying Gaze Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.medusa.petrifyingGazeAuraTurnStart(token);
    }
    let effectData = {
        'name': "Medusa: Petrifying Gaze",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>At the start of your next turn, you will be subjected to Medusa's Petrifying Gaze.</p>
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

async function petrifyingGazeAuraTurnStart(token) {
    if (mba.findEffect(token.actor, "Incapacitated")) return;
    if (mba.checkTrait(token.actor, "ci", "petrified")) return;
    if (mba.findEffect(token.actor, "Petrified")) return; // just overly cautious
    if (mba.findEffect(token.actor, "Medusa: Restrained")) return;
    if (mba.findEffect(token.actor, "Medusa: Petrification")) return;
    let effect = await mba.findEffect(token.actor, "Medusa: Petrifying Gaze");
    let medusaDoc = await fromUuid(effect.flags['mba-premades']?.originUuid);
    let medusaToken = medusaDoc.object;
    let choices = [["Avert Eyes (inability to attack Medusa)", "avert"], ["Embrace Petrifying Gaze (saving throw)", "save"]];
    let selection = await mba.dialog("Medusa: Petrifying Gaze", choices, `<p>You are about to be affected by</p><p><u>Medusa's Petrifying Gaze</u></p><p>What would you like to do?</p>`);
    if (!selection) selection = "save";
    if (selection === "avert") {
        const effectDataAvert = {
            'name': "Medusa: Avert Eyes",
            'icon': "modules/mba-premades/icons/conditions/avert_eyes.webp",
            'description': `
                <p>You averted your eyes to escape the effect of Medusa's Petrifying Gaze.</p>
                <p>You can't see the Medusa until the start of your next turn, when you can avert your eyes again.</p>
                <p>If you look at the Medusa in the meantime, you must immediately make the saving throw.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.monsters.medusa.petrifyingGazeAuraAvertEyes,preItemRoll',
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
        if (!mba.findEffect(token.actor, "Medusa: Avert Eyes")) await mba.createEffect(token.actor, effectDataAvert);
        return;
    }
    else if (selection === "save") {
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Medusa: Petrifying Gaze", false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': medusaDoc.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(medusaToken)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(medusaToken)
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
            .atLocation(medusaToken)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(medusaToken)
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
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(medusaToken)
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
            .atLocation(medusaToken)
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
        if (!featureWorkflow.failedSaves.size) return;
        let saveResult = featureWorkflow.saveResults[0].total;
        if (saveResult <= 9) await petrificationInstant(token);
        else if (saveResult > 9) await petrificationLong(token);
    }
}

async function petrifyingGazeAuraAvertEyes({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    for (let target of workflow.targets) {
        if (target.document.name != "Medusa") continue;
        let choices = [["Keep averting eyes (cancel)", "avert"], ["Fuck it, we <b>Ball</b> (save)", "save"]];
        let selection = await mba.dialog("Medusa: Petrifying Gaze", choices, "<b>You are going to look at Medusa</b>");
        if (!selection) selection = "save";
        if (selection === "avert") return false;
        let effect = await mba.findEffect(workflow.actor, "Medusa: Avert Eyes");
        if (effect) await mba.removeEffect(effect);
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Medusa: Petrifying Gaze", false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': target.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
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
            .atLocation(target)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
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
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(target)
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
            .atLocation(target)
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
        if (!featureWorkflow.failedSaves.size) return;
        let saveResult = featureWorkflow.saveResults[0].total;
        if (saveResult <= 9) await petrificationInstant(token);
        else if (saveResult > 9) await petrificationLong(token);
    }
}

async function petrificationLong(token) {
    async function effectMacroDel() {
        let featureData = await mbaPremades.helpers.getItemFromCompendium("mba-premades.MBA Monster Features", "Medusa: Petrifying Gaze", false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) return;
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} MedPet` })
        }
        const effectData = {
            'name': "Medusa: Petrification",
            'icon': "modules/mba-premades/icons/conditions/muddy.webp",
            'description': "You failed second saving throw and have turned into stone.",
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Petrified",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .from(token)
            .atLocation(token)
            .mask(token)
            .opacity(0.4)
            .filter("ColorMatrix", { contrast: 1, saturate: -1 })
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .attachTo(token)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .zIndex(1)
            .persist()
            .name(`${token.document.name} MedPet`)

            .effect()
            .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
            .atLocation(token)
            .mask(token)
            .opacity(1)
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .zIndex(0)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .attachTo(token)
            .persist()
            .name(`${token.document.name} MedPet`)

            .thenDo(async () => {
                await mbaPremades.helpers.createEffect(token.actor, effectData);
            })

            .play()
    };
    const effectData = {
        'name': "Medusa: Restrained",
        'icon': "modules/mba-premades/icons/conditions/muddy.webp",
        'description': `
            <p>You are restrained as you begin to magically turn into stone.</p>
            <p>At the end of your next turn you must repeat the saving throw.</p>
            <p>On a success, the effect ends. On a failure, you are petrified.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.createEffect(token.actor, effectData);
}

async function petrificationInstant(token) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MedPet` })
    }
    const effectData = {
        'name': "Medusa: Petrification",
        'icon': "modules/mba-premades/icons/conditions/muddy.webp",
        'description': "You failed saving throw by 5 or more and have turned into stone.",
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Petrified",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mbaPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .from(token)
        .atLocation(token)
        .mask(token)
        .opacity(0.4)
        .filter("ColorMatrix", { contrast: 1, saturate: -1 })
        .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
        .attachTo(token)
        .fadeIn(3000)
        .fadeOut(1000)
        .duration(5000)
        .zIndex(1)
        .persist()
        .name(`${token.document.name} MedPet`)

        .effect()
        .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
        .atLocation(token)
        .mask(token)
        .opacity(1)
        .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
        .zIndex(0)
        .fadeIn(3000)
        .fadeOut(1000)
        .duration(5000)
        .attachTo(token)
        .persist()
        .name(`${token.document.name} MedPet`)

        .thenDo(async () => {
            await mbaPremades.helpers.createEffect(token.actor, effectData);
        })

        .play()
}

async function petrifyingGazeAuraEnd(token) {
    effectAuras.remove('medusaPetrifyingGazeAura', token.document.uuid);
}

export let medusa = {
    'petrifyingGazeAuraCombatStart': petrifyingGazeAuraCombatStart,
    'petrifyingGazeAura': petrifyingGazeAura,
    'petrifyingGazeAuraTurnStart': petrifyingGazeAuraTurnStart,
    'petrifyingGazeAuraAvertEyes': petrifyingGazeAuraAvertEyes,
    'petrificationLong': petrificationLong,
    'petrificationInstant': petrificationInstant,
    'petrifyingGazeAuraEnd': petrifyingGazeAuraEnd
}