import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

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

    // To do: better animation

    new Sequence()

        .wait(300)

        .effect()
        .file("jb2a.particles.outward.purple.01.04")
        .atLocation(template)
        .rotateTowards(template, { cacheLocation: true })
        .scaleToObject(2)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000 })
        .scaleOut(0, 5000, { ease: "easeOutQuint", delay: -3000 })
        .anchor({ x: 0.5 })
        .zIndex(1)
        .filter("ColorMatrix", { hue: 170 })

        .wait(1000)

        .effect()
        .file("jb2a.moonbeam.01.intro.green")
        .attachTo(template)
        .scaleToObject(1)
        .zIndex(2)
        .opacity(0.85)

        .effect()
        .file("jb2a.moonbeam.01.loop.green")
        .attachTo(template)
        .scaleToObject(1)
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(2000)
        .zIndex(3)
        .opacity(0.85)
        .persist()
        .name(`SickRad`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await sickeningRadiance.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.sickeningRadiance?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag("mba-premades", "spell.sickeningRadiance." + token.id + ".turn", turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Sickening Radiance: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;

    //Inivisibily/Light block
    let effectData = {
        "name": "Sickening Radiance: Light",
        'icon': trigger.icon,
        'origin': trigger.itemUuid,
        'description': `
            <p>You are affected by Sickening Radiance and emit a dim, greenish light in a 5-foot radius.</p>
            <p>This light makes it impossible for you to benefit from being @UUID[Compendium.mba-premades.MBA SRD.Item.2dEv6KlLgFA4wOni]{Invisible}.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': "invisible",
                'priority': 50
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 5,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{intensity: 1, reverse: false, speed: 10, type: "smokepatch"}',
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#3b7401",
                'priority': 40
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: trigger.castLevel,
                    itemUuid: trigger.itemUuid
                }
            }
        }
    };
    let lightEffect = await mba.findEffect(token.actor, "Sickening Radiance: Light");
    if (!lightEffect) await mba.createEffect(token.actor, effectData);

    //Exhaustion Block
    let exhaustionLevel = template.flags["mba-premades"]?.spell?.sickeningRadiance?.[token.id]?.exhaustionLevel;
    let exhaustionEffect = token.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
    if (exhaustionLevel === undefined) {
        let originalLevel = 0;
        if (exhaustionEffect) {
            originalLevel = Number(exhaustionEffect.name.substring(11));
            if (isNaN(originalLevel)) originalLevel = 0;
        }
        await template.setFlag("mba-premades", "spell.sickeningRadiance." + token.id + ".exhaustionLevel", originalLevel);
    }
    if (!exhaustionEffect) {
        await mba.addCondition(token.actor, "Exhaustion 1");
        return;
    }
    let level = +exhaustionEffect.name.slice(-1);
    await mba.removeCondition(token.actor, `Exhaustion ${level}`);
    if (level === 10) level = 9;
    await mba.addCondition(token.actor, `Exhaustion ${level + 1}`);
}

async function end(template) {
    let tokens = template.flags["mba-premades"]?.spell?.sickeningRadiance;
    if (!tokens) return;
    for (let [key, value] of Object.entries(tokens)) {
        let token = game.canvas.tokens.get(key);
        if (!token) continue;
        let effect = token.actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
        if (!effect) continue;
        await mba.removeEffect(effect);
        if (value.exhaustionLevel === 0) continue;
        await mba.addCondition(token.actor, `Exhaustion ${value.exhaustionLevel}`, false);
    }
}

export let sickeningRadiance = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'end': end
}