import {constants} from "../../generic/constants.js";
import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";

async function touch({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.magical.02.dark_purple")
        .attachTo(token)
        .stretchTo(target)
        .missed(!workflow.hitTargets.size)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact.003.dark_purple")
        .attachTo(target)
        .scaleToObject(2.5)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .delay(100)
        .duration(5000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function rayOfCold({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.ray_of_frost.blue")
        .attachTo(workflow.token)
        .stretchTo(target)
        .missed(!workflow.hitTargets.size)
        .playIf(() => {
            return !workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.ray_of_frost.blue")
        .attachTo(workflow.token)
        .stretchTo(target)
        .repeats(4, 500)
        .waitUntilFinished(-3000)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.impact.ground_crack.frost.01.blue")
        .attachTo(target)
        .scaleToObject(1.3)
        .fadeIn(500)
        .endTime(3400)
        .fadeOut(1000)
        .opacity(0.2)
        .mask()
        .noLoop()
        .name(`${target.document.name} RaOfF`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function lifeDrainCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${token.document.name} AtrC`)

        .play()
}

async function lifeDrainItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let ammount = Math.floor(Math.min(workflow.damageRoll.total / 2));
    if (workflow.saves.size) ammount = Math.floor(Math.min(Math.floor(Math.min(workflow.damageRoll.total / 2)) / 2));
    let healingRoll = await new Roll(`${ammount}`).roll({ 'async': true });
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .wait(500)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} AtrC` });
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], "Life Drain", workflow.itemCardId);
        })

        .play()
}

async function summonWraith({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("Wraith");
    if (!sourceActor) {
        ui.notifications.warn("Unale to find actor! (Wraith)");
        return;
    }
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${token.document.name} AtrC`)

        .thenDo(async () => {
            let [spawnedTokenId] = await mba.spawn(sourceActor, updates, {}, workflow.token, 30, "shadow");
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} AtrC` });
            if (mba.inCombat()) {
                let specterDoc = canvas.scene.tokens.get(spawnedTokenId);
                let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === workflow.actor.id);
                let initiative = casterCombatant.initiative - 0.01;
                await socket.executeAsGM('createCombatant', spawnedTokenId, specterDoc.actor.id, canvas.scene.id, initiative);
            }
        })

        .play()
}

async function legendaryTouch({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Touch");
    if (!feature) {
        ui.notifications.warn("Unable to find item! (Touch)");
        return;
    }
    if (!workflow.targets.size) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function legendaryRayOfCold({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = await mba.getItem(workflow.actor, "Ray of Cold");
    if (!feature) {
        ui.notifications.warn("Unable to find item! (Ray of Cold)");
        return;
    }
    if (!workflow.targets.size) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function wailCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1.75)
        .randomRotation()
        .fadeIn(1000, { delay: 0 })
        .opacity(1)
        .aboveLighting()

        .effect()
        .file("jb2a.particles.inward.white.01.02")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .duration(500)
        .fadeOut(400)
        .scaleOut(0, 750, { ease: "easeOutCubic" })
        .opacity(0.5)
        .zIndex(1)
        .randomRotation()
        .aboveLighting()
        .repeats(4, 150, 150)
        .waitUntilFinished()

        .effect()
        .file("jb2a.impact.004.blue")
        .atLocation(workflow.token)
        .scaleToObject(6)
        .fadeIn(700)
        .fadeOut(1000)
        .scaleIn(0, 3000, { ease: "easeOutExpo" })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.4)
        .zIndex(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.1 })
        .randomRotation()
        .aboveLighting()
        .repeats(8, 450, 450)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.01.fast")
        .attachTo(workflow.token, { bindAlpha: false })
        .size(15, { gridUnits: true })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.5)
        .zIndex(0)
        .aboveLighting()
        .filter("ColorMatrix", { saturate: -1 })
        .repeats(8, 450, 450)

        .canvasPan()
        .delay(100)
        .shake({ duration: 3600, strength: 2, rotation: false, fadeOut: 1000 })

        .play()
}

async function wailItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let validTargetsUuids = [];
    for (let target of Array.from(workflow.targets)) {
        if (!mba.findEffect(target.actor, "Deafened")) validTargetsUuids.push(target.document.uuid);
    }
    if (!validTargetsUuids.length) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Atropal: Wail", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(validTargetsUuids);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    for (let target of Array.from(featureWorkflow.failedSaves)) {
        let exhaustion = target.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
        if (!exhaustion) {
            await mba.addCondition(target.actor, "Exhaustion 1");
            continue;
        }
        let level = +exhaustion.name.slice(-1);
        level += 1;
        await mba.addCondition(target.actor, `Exhaustion ${level}`);
    }
}

async function negativeEnergyAuraCombatStart(token, origin) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AtrNEA` });
        await mbaPremades.macros.monsters.atropal.negativeEnergyAuraEnd(token);
    };
    let effectData = {
        'name': "Negative Energy Aura",
        'icon': "modules/mba-premades/icons/generic/horrific_appearance.webp",
        'origin': origin.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.name',
                'mode': 5,
                'value': "negativeEnergyAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.range',
                'mode': 5,
                'value': "30",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.disposition',
                'mode': 5,
                'value': "all",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.effectName',
                'mode': 5,
                'value': "Negative Energy Field",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.macroName',
                'mode': 5,
                'value': "negativeEnergyAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.negativeEnergyAura.conscious',
                'mode': 5,
                'value': "true",
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
        'negativeEnergyAura': {
            'name': 'negativeEnergyAura',
            'range': 30,
            'disposition': 'all',
            'effectName': 'Negative Energy Field',
            'macroName': 'negativeEnergyAura',
            'conscious': true
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(token)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(token)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(4600)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${token.document.name} AtrC`)

        .effect()
        .file("jb2a.energy_strands.in.purple.01.2")
        .attachTo(token)
        .scaleToObject(1.5)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.cast_generic.02.dark_purple.0")
        .attachTo(token)
        .scaleToObject(2.2)
        .belowTokens()
        .repeats(4, 700)

        .wait(2600)

        .canvasPan()
        .delay(100)
        .shake({ duration: 5000, strength: 2, rotation: false, fadeOut: 1000 })

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.orangepurple")
        .attachTo(token, { followRoration: false })
        .size(13, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(2000)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .scaleOut(0, 2000, { ease: "linear" })
        .opacity(1)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${token.document.name} AtrNEA`)

        .effect()
        .file("jb2a.darkness.black")
        .attachTo(token, { followRoration: false })
        .size(13, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(2000)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .scaleOut(0, 2000, { ease: "linear" })
        .opacity(0.25)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${token.document.name} AtrNEA`)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} AtrC` });
            await mba.createEffect(token.actor, effectData);
            effectAuras.add(flagAuras, token.document.uuid, true);
        })

        .play()
}

async function negativeEnergyAura(token, selectedAura) {
    if (token.name === "Atropal") return;
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Negative Energy Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.atropal.negativeEnergyAuraTurnStart(token);
    }
    let effectData = {
        'name': "Negative Energy Field",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You are inside a field of negative energy.</p>
            <p>While inside, you are unable to reagin any hit points and take 3d6 necrotic damage at the start of each of your turns.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': 'healing',
                'priority': 20
            },
        ],
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
                }
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function negativeEnergyAuraTurnStart(token) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Negative Energy Aura: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.sacred_flame.purple")
        .attachTo(token)
        .scaleToObject(3)
        .playbackRate(2)
        .fadeOut(500)
        .zIndex(2)
        .belowTokens()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(token)
        .scaleToObject(1.65 * token.document.texture.scaleX)
        .delay(500)
        .duration(5000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .zIndex(1)
        .randomRotation()
        .belowTokens()

        .play()
}

async function negativeEnergyAuraEnd(token) {
    effectAuras.remove('negativeEnergyAura', token.document.uuid);
}

export let atropal = {
    'touch': touch,
    'rayOfCold': rayOfCold,
    'lifeDrainCast': lifeDrainCast,
    'lifeDrainItem': lifeDrainItem,
    'summonWraith': summonWraith,
    'legendaryTouch': legendaryTouch,
    'legendaryRayOfCold': legendaryRayOfCold,
    'wailCast': wailCast,
    'wailItem': wailItem,
    'negativeEnergyAuraCombatStart': negativeEnergyAuraCombatStart,
    'negativeEnergyAura': negativeEnergyAura,
    'negativeEnergyAuraTurnStart': negativeEnergyAuraTurnStart,
    'negativeEnergyAuraEnd': negativeEnergyAuraEnd
}