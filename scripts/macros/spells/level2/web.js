import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .size(4.2, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.markers.light_orb.loop.white")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .duration(2500)
        .belowTokens()
        .zIndex(2)
        .size(2, { gridUnits: true })

        .effect()
        .file("jb2a.shield_themed.above.eldritch_web.01.dark_green")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .duration(2500)
        .belowTokens()
        .zIndex(2.1)
        .size(0.9, { gridUnits: true })
        .opacity(0.5)
        .filter("ColorMatrix", { brightness: 0 })

        .effect()
        .file("jb2a.shield_themed.below.eldritch_web.01.dark_green")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(500)
        .duration(2500)
        .belowTokens()
        .zIndex(1.9)
        .size(0.9, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0 })
        .opacity(0.5)
        .waitUntilFinished(-200)

        .effect()
        .file("jb2a.impact.004.yellow")
        .atLocation(template)
        .size(6, { gridUnits: true })
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .file('jb2a.web.01')
        .atLocation(template)
        .belowTokens()
        .fadeIn(1500)
        .zIndex(1)
        .fadeOut(1500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .size(4.3, { gridUnits: true })
        .persist()
        .name(`Web`)

        .effect()
        .file('jb2a.web.01')
        .atLocation(template)
        .opacity(0.3)
        .fadeIn(1500)
        .zIndex(1)
        .fadeOut(1500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .size(4.3, { gridUnits: true })
        .persist()
        .name(`Web`)

        .play();
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'web',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'macroName': 'web',
                    'templateUuid': template.uuid,
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid
                }
            }
        }
    });
    if (!workflow.failedSaves.size) return;
    let effectData = {
        'name': "Web: Restrain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are stuck in a mass of thick, sticky webbing.</p>
            <p>You can use your action to make a Strength ability check. If you succeed, you are no longer restrained.</p>
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
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Restrain: Action Save, killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let i of Array.from(workflow.failedSaves)) await mba.createEffect(i.actor, effectData);
}

async function trigger(token, trigger) {
    if (mba.findEffect(token.actor, "Web: Restrain")) return;
    if (mba.findEffect(token.actor, "Restrained")) return;
    if (mba.checkTrait(token.actor, 'ci', 'restrained')) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.web?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.web.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Web: Restrain', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let effectData = {
        'name': "Web: Restrain",
        'icon': trigger.icon,
        'origin': trigger.itemUuid,
        'description': `
            <p>You are stuck in a mass of thick, sticky webbing.</p>
            <p>You can use your action to make a Strength ability check. If you succeed, you are no longer restrained.</p>
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
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${trigger.saveDC}, saveMagic=true, name=Restrain: Action Save, killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: trigger.castLevel,
                    itemUuid: trigger.itemUuid
                }
            }
        }

    };
    let newEffect = await mba.createEffect(token.actor, effectData);
    let concData = originItem.actor.getFlag("midi-qol", "concentration-data.removeUuids");
    concData.push(newEffect.uuid);
    await originItem.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await web.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: `Web` })
}

export let web = {
    'cast': cast,
    'item': item,
    'trigger': trigger,
    'enter': enter,
    'del': del
}