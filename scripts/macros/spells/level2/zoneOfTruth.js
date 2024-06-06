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
                    'createTime': game.time.worldTime,
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.enchantment.complete.dark_pink")
        .attachTo(template)
        .scaleToObject(1)
        .belowTokens()
        .opacity(0.7)
        .persist()
        .name(`Zone of Truth`)

        .effect()
        .file("jaamod.misc.qm_swarm")
        .attachTo(template)
        .scaleToObject(0.85)
        .delay(1500)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(1000)
        .tint("#8300b3")
        .playbackRate(0.85)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await zoneOfTruth.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.findEffect(token.actor, "Zone of Truth")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turnEntered = template.flags['mba-premades']?.spell?.zoneOfTruth?.tokens?.[token.id];
        let turnCurrent = `${game.combat.round}-${game.combat.turn}`;
        if (turnCurrent === turnEntered) return;
        await template.setFlag('mba-premades', 'spell.zoneOfTruth.tokens.' + token.id, turnCurrent);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Zone of Truth: Save', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    let duration = 600 - (game.time.worldTime - trigger.createTime);
    let effectData = {
        'name': "Zone of Truth",
        'icon': trigger.icon,
        'origin': trigger.itemUuid,
        'description': `
            <p>You can't speak a deliberate lie while are in the radius of Zone of Truth.</p>
            <p>You are aware of the spell and can thus avoid answering questions to which you would normally respond with a lie.</p>
            <p>You can be evasive in your answers as long as they remain within the boundaries of the truth.</p>
        `,
        'duration': {
            'seconds': duration
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: trigger.castLevel,
                    itemUuid: trigger.itemUuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jaamod.misc.qm")
        .attachTo(token)
        .scaleToObject(3)
        .fadeIn(500)
        .fadeOut(1000)
        .playbackRate(0.85)
        .filter("ColorMatrix", { hue: 220 })

        .wait(1000)

        .thenDo(async () => {
            if (featureWorkflow.failedSaves.size) await mba.createEffect(token.actor, effectData);
        })

        .play()
}

async function leave(token, template) {
    if (mba.inCombat()) await template.setFlag('mba-premades', 'spell.zoneOfTruth.tokens.' + token.id, '');
    let effect = mba.findEffect(token.actor, 'Zone of Truth');
    if (!effect) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    if (effect.origin != originUuid) return;
    await mba.removeEffect(effect);
}

async function del(template) {
    let tokenIds = template.flags['mba-premades']?.spell?.zoneOfTruth?.tokens;
    if (!tokenIds) return;
    let tokens = Object.keys(tokenIds).map(tokenId => canvas.tokens.get(tokenId));
    for (let token of tokens) {
        let effect = mba.findEffect(token.actor, 'Zone of Truth');
        if (!effect) continue;
        let originUuid = template.flags.dnd5e?.origin;
        if (!originUuid) continue;
        if (effect.origin != originUuid) continue;
        await mba.removeEffect(effect);
    }
}

export let zoneOfTruth = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'leave': leave,
    'del': del,
}