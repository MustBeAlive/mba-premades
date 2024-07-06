import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.actor.system.abilities.int.value <= 4) {
        ChatMessage.create({
            flavor: `<u>${target.document.name}</u> is unaffected by Tasha's Hideous Laughter!`,
            speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
        });
        await mba.createEffect(target.actor, constants.immunityEffectData);
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let saveDC = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} TaHiLa` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You perceive everything as hilariously funny and fall into fits of laughter. You are @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone} and @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated}.</p>
            <p>At the end of each of yours turns, and each time you take damage while affected by this spell, you can can make another Wisdom saving throw.</p>
            <p>You have advantage on the saving throw if it's triggered by damage. On a success, the spell ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Incapacitated",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=${saveDC}, saveMagic=true, name=Hideous Laughter: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.tashaHideousLaughter.damaged,isDamaged',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["zeroHP"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'tashaHideousLaughter': {
                        'spellDC': mba.getSpellDC(workflow.item)
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.music_notations.{{music}}.orange")
        .atLocation(workflow.token, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1.5 })
        .scaleToObject(0.5)
        .delay(500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(1)
        .playbackRate(1.5)
        .setMustache({
            "music": () => {
                const musics = [`bass_clef`, `beamed_quavers`, `crotchet`, `flat`, `quaver`, `treble_clef`];
                return musics[Math.floor(Math.random() * musics.length)];
            }
        })
        .repeats(5, 200, 200)
        .waitUntilFinished(-1500)

        .effect()
        .file("animated-spell-effects-cartoon.level 01.bless.blue")
        .atLocation(target, { randomOffset: 1.2, gridUnits: true })
        .scaleToObject(0.5)
        .repeats(8, 100, 100)
        .filter("ColorMatrix", { saturate: 1, hue: -170 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.mending.yellow")
        .atLocation(target)
        .scaleToObject(3)
        .opacity(0.75)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
        .zIndex(0)
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.impact.002.orange")
        .atLocation(target)
        .scaleToObject(2)
        .delay(300)
        .opacity(1)
        .filter("ColorMatrix", { hue: 6 })
        .zIndex(0)

        .effect()
        .file("jb2a.particles.inward.white.02.03")
        .atLocation(target)
        .size(1.75, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(300)
        .duration(1000)
        .fadeOut(1000)
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.magic.impact.01")
        .atLocation(target)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -210 })
        .zIndex(0)
        .belowTokens()

        .play();

    if (workflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.butterflies.few.yellow")
            .attachTo(target, { local: true, bindAlpha: false })
            .scaleToObject(2)
            .opacity(1)
            .zIndex(0)
            .persist()
            .name(`${target.document.name} TaHiLa`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
                if (!mba.findEffect(target.actor, "Prone")) await mba.addCondition(target.actor, 'Prone');
            })

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .file("modules/mba-premades/icons/conditions/overlay/laughter1.webp")
            .attachTo(target, { offset: { x: 0.4 * token.document.width, y: -0.45 * token.document.width }, gridUnits: true, local: true, bindAlpha: false })
            .scaleToObject(0.34)
            .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1200, ease: "easeOutCubic" })
            .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
            .persist()
            .name(`${target.document.name} TaHiLa`)

            .effect()
            .file("modules/mba-premades/icons/conditions/overlay/laughter2.webp")
            .attachTo(target, { offset: { x: 0.55 * token.document.width, y: 0 }, gridUnits: true, local: true, bindAlpha: false })
            .scaleToObject(0.34)
            .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 1200, ease: "easeOutCubic" })
            .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 1200, gridUnits: true, pingPong: false })
            .persist()
            .name(`${target.document.name} TaHiLa`)

            .effect()
            .from(target)
            .scaleToObject(1, { considerTokenScale: true })
            .attachTo(target, { bindAlpha: false })
            .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
            .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 600, ease: "easeOutCubic", pingPong: true })
            .rotate(-90)
            .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
            .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 300, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
            .persist()
            .name(`${target.document.name} TaHiLa`)

            .animation()
            .on(target)
            .opacity(1)

            .play();
    }
}

async function damaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(actor, "Tasha's Hideous Laughter");
    if (!effect) {
        ui.notifications.warn("Unable to find the effect! (Tasha's Hideous Laughter)");
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Tasha's Hideous Laughter: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades']?.spell?.tashaHideousLaughter?.spellDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await mba.createEffect(actor, constants.advantageEffectData);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

export let tashaHideousLaughter = {
    'cast': cast,
    'item': item,
    'damaged': damaged
}