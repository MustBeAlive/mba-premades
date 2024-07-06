import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'sourceUuid': workflow.token.document.uuid,
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.magic_signs.circle.02.abjuration.complete.dark_blue")
        .attachTo(template)
        .scaleToObject(1.2)
        .duration(9000)
        .fadeOut(500)

        .effect()
        .file("jb2a.spirit_guardians.blue.particles")
        .attachTo(template)
        .scaleToObject(1.4)
        .delay(2500)
        .duration(6500)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(2)

        .effect()
        .file("jb2a.spike_trap.05x05ft.top.base.still_frame.hidden")
        .attachTo(template)
        .scaleToObject(1.9)
        .delay(3500)
        .duration(5500)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(1)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await snare.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.getSize(token.actor) > 3) return;
    if (mba.checkTrait(token.actor, "ci", "restrained")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (template.flags['mba-premades']?.template?.triggered === true) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Snare: Trigger", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroDel() {
        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.pulse.red")
            .atLocation(token, { offset: { y: 0.2 }, gridUnits: true })
            .size({ width: token.document.width * 1.5, height: token.document.width * 1.45 }, { gridUnits: true })
            .belowTokens()
            .zIndex(1)
            .waitUntilFinished()

            .animation()
            .on(token)
            .opacity(1)

            .play()

        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Snare` });
        await token.document.update({ elevation: 0 });
        await mbaPremades.helpers.addCondition(actor, "Prone");
    };
    const effectData = {
        'name': "Snare",
        'icon': "modules/mba-premades/icons/spells/level1/snare1.webp",
        'origin': template.flags['mba-premades']?.template?.itemUuid,
        'description': `
            <p>You triggered a magical trap and are hoisted into the air, hanging upside down 3 feet above the ground. Until the spell ends, you are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained}.</p>
            <p>At the end of each of your turns, you can make a Dexterity saving throw, ending the effect on a success.</p>
            <p>Alternatively, you or someone else who can reach you can use an action to make an Intelligence (Arcana) check, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=dex, saveDC=${trigger.saveDC}, saveMagic=true, name=Restain: Turn End (DC${trigger.saveDC}), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=arc, saveDC=${trigger.saveDC}, saveMagic=false, name=Restain: Action Save (DC${trigger.saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: template.flags['mba-premades']?.template?.castLevel,
                    itemUuid: template.flags['mba-premades']?.template?.itemUuid
                }
            },
            'mba-premades': {
                'spell': {
                    'snare': {
                        'sourceUuid': originUuid
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.pulse.red")
        .atLocation(token, { offset: { y: 0.2 }, gridUnits: true })
        .size({ width: token.width * 1.5, height: token.width * 1.45 }, { gridUnits: true })
        .belowTokens()
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.105")
        .atLocation(token, { offset: { y: 0.05 }, gridUnits: true })
        .opacity(1)
        .scaleToObject(2)
        .tint("#ff2929")
        .belowTokens()

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .from(token)
        .attachTo(token, { bindAlpha: false, followRotation: true, locale: false })
        .scaleToObject(1, { considerTokenScale: true })
        .opacity(1)
        .duration(800)
        .loopProperty("sprite", "position.y", { from: 0, to: -30, duration: 5000, pingPong: true })
        .filter("Glow", { color: 0xff2929, distance: 10, outerStrength: 4, innerStrength: 0 })
        .zIndex(2)
        .fadeOut(500)
        .persist()
        .name(`${token.name} Snare`)

        .effect()
        .file("jb2a.particles.outward.red.02.04")
        .scaleToObject(1.35, { considerTokenScale: true })
        .attachTo(token, { bindAlpha: false })
        .opacity(1)
        .duration(800)
        .loopProperty("sprite", "position.y", { from: 0, to: -30, duration: 5000, pingPong: true })
        .fadeIn(1000)
        .zIndex(2.2)
        .fadeOut(500)
        .persist()
        .name(`${token.name} Snare`)

        .effect()
        .from(token)
        .atLocation(token)
        .scaleToObject(0.9)
        .duration(1000)
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .attachTo(token, { bindAlpha: false })
        .zIndex(1)
        .fadeOut(500)
        .persist()
        .name(`${token.name} Snare`)

        .play();

    await mba.createEffect(token.actor, effectData);
    await token.update({ elevation: 3 });
    let templateEffect = await mba.findEffect(originItem.actor, "Snare Template");
    if (templateEffect) await mba.removeEffect(templateEffect);
}

export let snare = {
    'cast': cast,
    'enter': enter,
    'trigger': trigger,
}