import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    await template.update({
        'flags': {
            'mba-premades': {
                'spell': {
                    'darkness': true
                },
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid
                }
            }
        }
    });
    const effectData = {
        'name': "Hunger of Hadar",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are inside a void which is filled with a cacophony of soft whispers and slurping noises. No light, magical or otherwise, can illuminate the area, and you are blinded.</p>
            <p>Any creature that starts its turn inside the Hunger of Hadar area takes 2d6 cold damage.</p>
            <p>Any creature that ends its turn inside the Hunger of Hadar area must succeed on a Dexterity saving throw or take 2d6 acid damage as milky, otherworldly tentacles rub against it.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let targets = Array.from(workflow.targets);


    new Sequence()

        .wait(500)

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .size(8, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .delay(1500)
        .fadeIn(200)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .zIndex(2)
        .filter("ColorMatrix", { brightness: 0 })
        .playbackRate(0.7)

        .effect()
        .file("jb2a.darkness.black")
        .attachTo(template)
        .size(8.8, { gridUnits: true })
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .randomRotation()
        .opacity(0.7)
        .zIndex(3)
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.bluepurple")
        .attachTo(template)
        .size(8.8, { gridUnits: true })
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.5)
        .playbackRate(1)
        .zIndex(2)
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jaamod.spells_effects.tentacles_black2")
        .attachTo(template)
        .size(8.8, { gridUnits: true })
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.5)
        .playbackRate(0.8)
        .zIndex(1)
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jb2a.impact.ground_crack.frost.01.white")
        .attachTo(template)
        .size(8.8, { gridUnits: true })
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.5)
        .zIndex(0)
        .randomRotation()
        .persist()
        .endTime(3400)
        .noLoop()
        .name(`Hunger of Hadar`)

        .wait(3500)

        .thenDo(async () => {
            for (let target of targets) await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await hungerOfHadar.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.findEffect(token.actor, "Hunger of Hadar")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    await template.setFlag('mba-premades', 'spell.hungerOfHadar.tokens.' + token.id, token.id);
    const effectData = {
        'name': "Hunger of Hadar",
        'icon': "modules/mba-premades/icons/spells/level3/hunger_of_hadar.webp",
        'origin': trigger.itemUuid,
        'description': `
            <p>You are inside a void which is filled with a cacophony of soft whispers and slurping noises. No light, magical or otherwise, can illuminate the area, and you are blinded.</p>
            <p>Any creature that starts its turn inside the Hunger of Hadar area takes 2d6 cold damage.</p>
            <p>Any creature that ends its turn inside the Hunger of Hadar area must succeed on a Dexterity saving throw or take 2d6 acid damage as milky, otherworldly tentacles rub against it.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: trigger.castLevel,
                    itemUuid: trigger.itemUuid
                }
            }
        }
    };
    await mba.createEffect(token.actor, effectData);
}

async function leave(template, token) {
    await template.unsetFlag('mba-premades', 'spell.hungerOfHadar.tokens.' + token.id, token.id);
    let effect = mba.findEffect(token.actor, 'Hunger of Hadar');
    if (!effect) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    if (effect.origin != originUuid) return;
    await mba.removeEffect(effect);
}

async function turnStart(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hunger of Hadar: Bitter Cold', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function turnEnd(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hunger of Hadar: Milky Tentacles', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function end(template) {
    let tokenIds = template.flags['mba-premades']?.spell?.hungerOfHadar?.tokens;
    if (!tokenIds) return;
    let tokens = Object.keys(tokenIds).map(tokenId => canvas.tokens.get(tokenId));
    for (let token of tokens) {
        let effect = mba.findEffect(token.actor, 'Hunger of Hadar');
        if (!effect) continue;
        let originUuid = template.flags.dnd5e?.origin;
        if (!originUuid) continue;
        if (effect.origin != originUuid) continue;
        await mba.removeEffect(effect);
    }
}

export let hungerOfHadar = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'leave': leave,
    'turnStart': turnStart,
    'turnEnd': turnEnd,
    'end': end
}