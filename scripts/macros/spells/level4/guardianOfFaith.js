import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ammount': 60,
                    'castLevel': workflow.castData.castLevel,
                    'disposition': workflow.token.document.disposition,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mbaPremades.helpers.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });

    new Sequence()

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.yellow`)
        .size(6, { gridUnits: true })
        .fadeIn(600)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(template)
        .scaleToObject(0.8)
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.8)
        .persist()
        .name('Guardian of Faith')

        .effect()
        .file("modules/mba-premades/icons/spells/level4/guardian_of_faith/guardian_of_faith.webp")
        .attachTo(template)
        .size(2.2, { gridUnits: true })
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1)
        .zIndex(1)
        .persist()
        .name('Guardian of Faith')

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await guardianOfFaith.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (trigger.disposition === token.disposition) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.guardianOfFaith?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.guardianOfFaith.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Guardian of Faith: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    let ammount = trigger.ammount;
    if (featureWorkflow.failedSaves.size) ammount -= 20;
    else ammount -= 10;
    if (ammount <= 0) {
        let effect = mba.findEffect(originItem.actor, "Guardian of Faith Template");
        if (effect) await mba.removeEffect(effect);
        return;
    }
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ammount': ammount,
                }
            }
        }
    });
}

export let guardianOfFaith = {
    'item': item,
    'enter': enter,
    'trigger': trigger
}