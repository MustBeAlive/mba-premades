import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let tokens = await mba.findNearby(workflow.token.document, 300, "ally", false, false);
    await mba.playerDialogMessage();
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, tokens, false, 'multiple', undefined, false, 'Choose targets to be ignored by Cordon of Arrows:');
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i);
    mba.updateTargets(newTargets);
    let ignoreIds = [];
    ignoreIds.push(workflow.token.id);
    for (let i of Array.from(game.user.targets)) ignoreIds.push(i.id);
    let ammount = workflow.castData.castLevel * 2;
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ammount': ammount,
                    'castLevel': workflow.castData.castLevel,
                    'ignoreIds': ignoreIds,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    let effect = await mba.findEffect(workflow.actor, "Cordon of Arrows Template");
    if (!effect) return;
    let updates = {
        'description': `<p>Arrows left: <b>${ammount}</b></p>`
    };
    await mba.updateEffect(effect, updates);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cordonOfArrows.trigger(token.document, trigger);
}

async function end(template, token) {
    if (mba.inCombat()) {
        let prev = game.combat.turn;
        let turn;
        if (prev != 0 ) {
            prev = game.combat.turn - 1;
            turn = game.combat.round + '-' + prev;
        }
        else if (prev === 0) {
            prev = game.combat.turns.length - 1;
            turn = (game.combat.round - 1) + "-" + prev;
        }
        let lastTurn = template.flags['mba-premades']?.spell?.cordonOfArrows?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cordonOfArrows.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (template.flags['mba-premades']?.template?.ignoreIds.includes(token.id)) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.cordonOfArrows?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.cordonOfArrows.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Cordon of Arrows: Arrow Strike", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let ammount = template.flags['mba-premades']?.template?.ammount;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    new Sequence()

        .effect()
        .file("jb2a.cast_shape.circle.single01.blue")
        .attachTo(template)
        .scale(0.33)
        .waitUntilFinished(-2000)

        .effect()
        .file("jb2a.arrow.physical.blue")
        .atLocation(template)
        .stretchTo(token, { attachTo: true })
        .missed(!featureWorkflow.failedSaves.size)

        .play();

    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ammount': ammount - 1,
                }
            }
        }
    });
    let effect = await mba.findEffect(originItem.actor, "Cordon of Arrows Template");
    if (!effect) return;
    if (template.flags['mba-premades']?.template?.ammount < 1) {
        await mba.removeEffect(effect);
        return;
    }
    let updates = {
        'description': `<p>Arrows left: <b>${ammount - 1}</b></p>`
    };
    await mba.updateEffect(effect, updates);
}

export let cordonOfArrows = {
    'item': item,
    'enter': enter,
    'end': end,
    'trigger': trigger,
}