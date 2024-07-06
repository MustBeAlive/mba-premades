import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'spell': {
                    'fogCloud': true
                },
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
        .file("jb2a.magic_signs.circle.02.conjuration.complete.yellow")
        .attachTo(template)
        .scaleToObject(1)
        .belowTokens()
        .zIndex(1)

        .effect()
        .file("jb2a.cast_generic.ice.01.blue.0")
        .attachTo(template)
        .scaleToObject(0.5)
        .delay(1500)
        .waitUntilFinished(-500)

        .effect()
        .file('jb2a.impact_themed.ice_shard.01.blue')
        .attachTo(template)
        .scaleToObject(0.5)

        .effect()
        .file("jb2a.sleet_storm.02.blue")
        .attachTo(template)
        .scaleToObject(1.2)  
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .zIndex(2)
        .persist()
        .name(`Sleet Storm`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await sleetStorm.prone(token.document, trigger);
}

async function turnStart(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await sleetStorm.conc(token.document, trigger);
}

async function prone(token, trigger) {
    if (mba.findEffect(token.actor, "Prone")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.sleetStorm?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.sleetStorm.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Sleet Storm: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    await mba.addCondition(token.actor, "Prone");
}

async function conc(token, trigger) {
    if (!mba.findEffect(token.actor, "Concentrating")) return;
    await MidiQOL.doConcentrationCheck(token.actor, trigger.saveDC);
}

export let sleetStorm = {
    'item': item,
    'enter': enter,
    'turnStart': turnStart,
    'prone': prone,
    'conc': conc
}