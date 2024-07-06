import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
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

    new Sequence()

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.green`)
        .size(8, { gridUnits: true })
        .fadeIn(600)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.spells_effects.insect_plague0")
        .attachTo(template)
        .size(8, { gridUnits: true })
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(1000)
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 4,
            gridUnits: true,
            name: "test",
            isMask: true
        })
        .opacity(0.7)
        .playbackRate(0.7)
        .persist()
        .name(`Insect Plague`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await insectPlague.trigger(token.document, trigger);
}

async function end(template, token) {
    if (mba.inCombat()) {
        let prev = game.combat.turn;
        if (prev != 0) prev = game.combat.turn - 1;
        else if (prev === 0) prev = game.combat.turns.length - 1;
        let turn = game.combat.round + '-' + prev;
        let lastTurn = template.flags['mba-premades']?.spell?.insectPlague?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await insectPlague.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.insectPlague?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.insectPlague.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Insect Plague: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts = [[`${trigger.castLevel - 1}d10[piercing]`, "piercing"]];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

export let insectPlague = {
    'item': item,
    'enter': enter,
    'end': end,
    'trigger': trigger
}