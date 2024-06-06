import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .wait(500)

        .effect()
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .attachTo(template)
        .size(2.2, { gridUnits: true })
        .fadeIn(600)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .atLocation(token)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .waitUntilFinished(500)

        .effect()
        .file("jb2a.water_splash.circle.01.black")
        .attachTo(template)
        .size(1.5, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .belowTokens()
        .zIndex(2)

        .effect()
        .file('jb2a.grease.dark_brown')
        .attachTo(template)
        .size(2.2, { gridUnits: true })
        .delay(100)
        .fadeIn(5000)
        .fadeOut(1000)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`Grease`)

        .play()

    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    if (!workflow.failedSaves.size) return;
    for (let i of Array.from(workflow.failedSaves)) await mba.addCondition(i.actor, 'Prone');
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await grease.trigger(token.document, trigger);
}

async function end(template, token) {
    if (mba.inCombat()) {
        let prev = game.combat.turn;
        if (prev != 0) prev = game.combat.turn - 1;
        else if (prev === 0) prev = game.combat.turns.length - 1;
        let turn = game.combat.round + '-' + prev;
        let lastTurn = template.flags['mba-premades']?.spell?.grease?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await grease.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.checkTrait(token.actor, 'ci', 'prone')) return;
    if (mba.findEffect(token.actor, "Prone")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.grease?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.grease.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Grease: Fall', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    await mba.addCondition(token.actor, "Prone");
}

export let grease = {
    'item': item,
    'enter': enter,
    'end': end,
    'trigger': trigger,
}