import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .wait(500)

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .size(4.2, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .attachTo(workflow.token)
        .size(1.75, { gridUnits: true })
        .delay(500)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.markers.light_orb.loop.white")
        .attachTo(template)
        .size(2, { gridUnits: true })
        .duration(2500)
        .fadeIn(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(2)

        .effect()
        .file("jb2a.shield_themed.above.eldritch_web.01.dark_green")
        .attachTo(template)
        .size(0.9, { gridUnits: true })
        .duration(2500)
        .fadeIn(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(2.1)
        .opacity(0.5)
        .filter("ColorMatrix", { brightness: 0 })

        .effect()
        .file("jb2a.shield_themed.below.eldritch_web.01.dark_green")
        .attachTo(template)
        .size(0.9, { gridUnits: true })
        .duration(2500)
        .fadeIn(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .zIndex(1.9)
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { brightness: 0 })
        .waitUntilFinished(-200)

        .effect()
        .file("jb2a.impact.004.yellow")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .file('jb2a.web.01')
        .attachTo(template)
        .size(4.3, { gridUnits: true })
        .fadeIn(1500)
        .fadeOut(1500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .zIndex(1)
        .belowTokens()
        .persist()
        .name(`Web`)

        .effect()
        .file('jb2a.web.01')
        .attachTo(template)
        .size(4.3, { gridUnits: true })
        .fadeIn(1500)
        .fadeOut(1500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .opacity(0.3)
        .zIndex(1)
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
                    'castLevel': workflow.castData.castLevel,
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    if (!workflow.failedSaves.size) return;
    let saveDC = mba.getSpellDC(workflow.item);
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
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${saveDC}, saveMagic=true, name=Restrain: Action Save (DC${saveDC}), killAnim=true`,
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
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.getItem(token.actor, "Web Walker")) await mba.createEffect(target.actor, effectData);
    }
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await web.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.getItem(token.actor, "Web Walker")) return;
    if (mba.checkTrait(token.actor, "ci", "restrained")) return;
    if (mba.findEffect(token.actor, "Web: Restrain")) return;
    if (mba.findEffect(token.actor, "Restrained")) return;
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
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Web: Restrain", false);
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
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${trigger.saveDC}, saveMagic=true, name=Restrain: Action Save (DC${trigger.saveDC}), killAnim=true`,
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

export let web = {
    'cast': cast,
    'item': item,
    'enter': enter,
    'trigger': trigger,
}