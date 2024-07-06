import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function chromatic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    let damageType;
    let animation;
    let rate;
    let icon;
    if (mba.getItem(workflow.actor, "Chromatic Ancestry (Black)")) damageType = "acid";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Blue)")) damageType = "lightning";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Green)")) damageType = "poison";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Red)")) damageType = "fire";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (White)")) damageType = "cold";
    if (!damageType) {
        ui.notifications.warn("Unable to define damage type!");
        return;
    }
    switch (damageType) {
        case "acid": {
            animation = "jb2a.breath_weapons.acid.line.green";
            rate = 1.2;
            icon = "modules/mba-premades/icons/generic/breath_acid.webp";
            break;
        }
        case "cold": {
            animation = "jb2a.breath_weapons.fire.line.blue";
            rate = 1.4;
            icon = "modules/mba-premades/icons/generic/breath_cold.webp";
            break;
        }
        case "fire": {
            animation = "jb2a.breath_weapons.fire.line.orange";
            rate = 1.4;
            icon = "modules/mba-premades/icons/generic/breath_fire.webp";
            break;
        }
        case "lightning": {
            animation = "jb2a.breath_weapons.lightning.line.blue";
            rate = 1.2;
            icon = "modules/mba-premades/icons/generic/breath_lightning.webp";
            break;
        }
        case "poison": {
            animation = "jb2a.breath_weapons.fire.line.green";
            rate = 1.4;
            icon = "modules/mba-premades/icons/generic/breath_poison.webp";
            break;
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warm("Unable to find template!");
        return;
    }

    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .stretchTo(template)
        .fadeIn(1500)
        .playbackRate(rate)

        .play()

    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Race Feature Items', "Breath Weapon: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let level = workflow.actor.system.details.level;
    let damageDice = 1;
    if (level >= 5 && level < 11) damageDice = 2;
    else if (level >= 11 && level < 17) damageDice = 3;
    else if (level >= 17) damageDice = 4;
    featureData.system.damage.parts = [[`${damageDice}d10[${damageType}]`, `${damageType}`]];
    featureData.system.save.dc = 8 + workflow.actor.system.abilities.con.mod + workflow.actor.system.attributes.prof;
    featureData.system.save.ability
    featureData.img = icon;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) targetUuids.push(i.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function metallic({ speaker, actor, token, character, item, args, scope, workflow }) {
    let level = workflow.actor.system.details.level;
    let damageType;
    let animation;
    let rate;
    let icon;
    if (mba.getItem(workflow.actor, "Metallic Ancestry (Brass)")) damageType = "fire";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Bronze)")) damageType = "lightning";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Copper)")) damageType = "acid";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Gold)")) damageType = "fire";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Silver)")) damageType = "cold";
    if (!damageType) {
        ui.notifications.warn("Unable to define damage type!");
        return;
    }
    switch (damageType) {
        case "acid": {
            animation = "jb2a.breath_weapons02.burst.cone.fire.green.01";
            rate = 1.4;
            icon = "modules/mba-premades/icons/generic/breath_acid.webp";
            break;
        }
        case "cold": {
            animation = "jb2a.breath_weapons.cold.cone.blue";
            rate = 1.8;
            icon = "modules/mba-premades/icons/generic/breath_cold.webp";
            break;
        }
        case "fire": {
            animation = "jb2a.breath_weapons.fire.cone.orange.02";
            rate = 1.5;
            icon = "modules/mba-premades/icons/generic/breath_fire.webp";
            break;
        }
        case "lightning": {
            animation = "jb2a.template_cone_5e.lightning.01.complete.bluepurple";
            rate = 1.5;
            icon = "modules/mba-premades/icons/generic/breath_lightning.webp";
            break;
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warm("Unable to find template!");
        return;
    }

    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scaleToObject(1.2)
        .fadeIn(1500)
        .playbackRate(rate)

        .play()

    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Race Feature Items', "Breath Weapon: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let damageDice = 1;
    if (level >= 5 && level < 11) damageDice = 2;
    else if (level >= 11 && level < 17) damageDice = 3;
    else if (level >= 17) damageDice = 4;
    featureData.system.damage.parts = [[`${damageDice}d10[${damageType}]`, `${damageType}`]];
    featureData.system.save.dc = 8 + workflow.actor.system.abilities.con.mod + workflow.actor.system.attributes.prof;
    featureData.img = icon;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(workflow.targets).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function metallic5({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["<b>Enervating Breath</b> (fail = incapacitated)", "enervate"],
        ["<b>Repulsion Breath</b> (fail = push 20ft + prone)", "repulsion"]
    ];
    let breathType = await mba.dialog("Metallic Breath Weapon", choices, `<b>Choose breath type:</b>`);
    if (!breathType) return;
    let damageType;
    let animation;
    let rate;
    let icon;
    if (mba.getItem(workflow.actor, "Metallic Ancestry (Brass)")) damageType = "fire";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Bronze)")) damageType = "lightning";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Copper)")) damageType = "acid";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Gold)")) damageType = "fire";
    else if (mba.getItem(workflow.actor, "Metallic Ancestry (Silver)")) damageType = "cold";
    if (!damageType) {
        ui.notifications.warn("Unable to define damage type!");
        return;
    }
    switch (damageType) {
        case "acid": {
            animation = "jb2a.breath_weapons02.burst.cone.fire.green.01";
            rate = 1.4;
            icon = "modules/mba-premades/icons/generic/breath_acid.webp";
            break;
        }
        case "cold": {
            animation = "jb2a.breath_weapons.cold.cone.blue";
            rate = 1.8;
            icon = "modules/mba-premades/icons/generic/breath_cold.webp";
            break;
        }
        case "fire": {
            animation = "jb2a.breath_weapons.fire.cone.orange.02";
            rate = 1.5;
            icon = "modules/mba-premades/icons/generic/breath_fire.webp";
            break;
        }
        case "lightning": {
            animation = "jb2a.template_cone_5e.lightning.01.complete.bluepurple";
            rate = 1.5;
            icon = "modules/mba-premades/icons/generic/breath_lightning.webp";
            break;
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warm("Unable to find template!");
        return;
    }

    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scaleToObject(1.2)
        .fadeIn(1500)
        .playbackRate(rate)

        .play()

    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Race Feature Items', "Breath Weapon: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = 8 + workflow.actor.system.abilities.con.mod + workflow.actor.system.attributes.prof;
    featureData.system.save.ability = "con";
    if (breathType === "repulsion") featureData.system.save.ability = "str";
    featureData.img = icon;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(workflow.targets).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let targets = Array.from(featureWorkflow.failedSaves);
    if (breathType === "enervate") {
        let effectData = {
            'name': workflow.item.name,
            'icon': icon,
            'origin': workflow.item.uuid,
            'description': `
                <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} until the start of <b>${workflow.token.document.name}</b> next turn.</p>
            `,
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Incapacitated",
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStartSource']
                }
            }
        };
        for (let target of targets) await mba.createEffect(target.actor, effectData);
    }
    else if (breathType === "repulsion") {
        for (let target of targets) {
            await mba.pushToken(workflow.token, target, 20);
            await mba.addCondition(target.actor, "Prone");
        }
    }
}


export let dragonbornBreathWeapon = {
    'chromatic': chromatic,
    'metallic': metallic,
    'metallic5': metallic5
}