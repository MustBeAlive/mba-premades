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
                    'templateUuid': template.uuid
                }
            }
        }
    });

    let animation1;
    let animation2;
    let animation3 = "jb2a.cloud_of_daggers.";
    let throwHue;
    let hue2;
    let choicesColor;
    let choicesType = [
        ["Daggers", "daggers", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Yellow_Thumb.webp"],
        ["Kunai", "kunai", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Yellow_Thumb.webp"]
    ]
    await mba.playerDialogMessage();
    let selectionType = await mbaPremades.helpers.selectImage("Cloud of Daggers: Type", choicesType, "Choose animation type:", "value");
    if (!selectionType) selectionType === "daggers";
    if (selectionType === "daggers") {
        animation3 += "daggers.";
        choicesColor = [
            ["Blue", "blue", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Blue_Thumb.webp"],
            ["Dark Purple", "dark_purple", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Dark_Purple_Thumb.webp"],
            ["Dark Red", "dark_red", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Dark_Red_Thumb.webp"],
            ["Green", "green", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Green_Thumb.webp"],
            ["Orange", "orange", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Orange_Thumb.webp"],
            ["Purple", "purple", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Purple_Thumb.webp"],
            ["Red", "red", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Red_Thumb.webp"],
            ["Yellow", "yellow", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_01_Light_Yellow_Thumb.webp"],
        ];
    }
    else if (selectionType === "kunai") {
        animation3 += "kunai.";
        choicesColor = [
            ["Blue", "blue", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Blue_Thumb.webp"],
            ["Dark Purple", "dark_purple", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Dark_Purple_Thumb.webp"],
            ["Dark Red", "dark_red", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Dark_Red_Thumb.webp"],
            ["Green", "green", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Green_Thumb.webp"],
            ["Orange", "orange", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Orange_Thumb.webp"],
            ["Purple", "purple", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Purple_Thumb.webp"],
            ["Red", "red", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Red_Thumb.webp"],
            ["Yellow", "yellow", "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Yellow_Thumb.webp"],
        ];
    }
    let selectionColor = await mbaPremades.helpers.selectImage("Cloud of Daggers: Color", choicesColor, "Choose animation color:", "value");
    if (!selectionColor) selectionColor === "yellow";
    if (selectionColor === "blue") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.blue";
        animation2 = "jb2a.impact.blue.0";
        animation3 += "blue";
        throwHue = 0;
        hue2 = 140;
    }
    else if (selectionColor === "dark_purple") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.dark_purple";
        animation2 = "jb2a.impact.dark_purple.2";
        animation3 += "dark_purple";
        throwHue = 0;
        hue2 = 200;
    }
    else if (selectionColor === "dark_red") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.red";
        animation2 = "jb2a.impact.dark_red.3";
        animation3 += "dark_red";
        throwHue = 0;
        hue2 = 320;
    }
    else if (selectionColor === "green") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.blue";
        animation2 = "jb2a.impact.green.0";
        animation3 += "green";
        throwHue = 280;
        hue2 = 75;
    }
    else if (selectionColor === "orange") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.red";
        animation2 = "jb2a.impact.orange.0";
        animation3 += "orange";
        throwHue = 25;
        hue2 = 350;
    }
    else if (selectionColor === "purple") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.red";
        animation2 = "jb2a.impact.purple.0";
        animation3 += "purple";
        throwHue = 300;
        hue2 = 200;
    }
    else if (selectionColor === "red") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.red";
        animation2 = "jb2a.impact.red.0";
        animation3 += "red";
        throwHue = 0;
        hue2 = 320;
    }
    else if (selectionColor === "yellow") {
        if (selectionType === "kunai") animation1 = "jb2a.kunai.throw.01";
        else animation1 = "jb2a.dagger.throw.01.red";
        animation2 = "jb2a.impact.orange.0";
        animation3 += "yellow";
        throwHue = 50;
        hue2 = 20;
    }
    await mba.clearPlayerDialogMessage();

    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];

    await new Sequence()

        .wait(100)

        .effect()
        .file(animation1)
        .attachTo(workflow.token, { offset: offset[2], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[2], gridUnits: true, followRotation: false })
        .scale(0.4)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: throwHue })
        .name(`${workflow.token.document.name} Dagger 3`)

        .effect()
        .file(animation2)
        .delay(1100)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[2], gridUnits: true, followRotation: false })

        .effect()
        .file(animation1)
        .delay(100)
        .attachTo(workflow.token, { offset: offset[0], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[0], gridUnits: true, followRotation: false })
        .scale(0.4)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: throwHue })
        .name(`${workflow.token.document.name} Dagger 1`)

        .effect()
        .file(animation2)
        .delay(1200)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[0], gridUnits: true, followRotation: false })

        .effect()
        .file(animation1)
        .delay(200)
        .attachTo(workflow.token, { offset: offset[3], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[3], gridUnits: true, followRotation: false })
        .scale(0.4)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: throwHue })
        .name(`${workflow.token.document.name} Dagger 4`)

        .effect()
        .file(animation2)
        .delay(1300)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[3], gridUnits: true, followRotation: false })

        .effect()
        .file(animation1)
        .delay(300)
        .attachTo(workflow.token, { offset: offset[1], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[1], gridUnits: true, followRotation: false })
        .scale(0.4)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: throwHue })
        .name(`${workflow.token.document.name} Dagger 2`)

        .effect()
        .file(animation2)
        .delay(1400)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[1], gridUnits: true, followRotation: false })

        .effect()
        .file(animation1)
        .delay(400)
        .attachTo(workflow.token, { offset: offset[4], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[4], gridUnits: true, followRotation: false })
        .scale(0.4)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: throwHue })
        .name(`${workflow.token.document.name} Dagger 5`)

        .effect()
        .file(animation2)
        .delay(1500)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[4], gridUnits: true, followRotation: false })

        .effect()
        .file("animated-spell-effects-cartoon.misc.spark")
        .delay(1400)
        .attachTo(template)
        .scaleToObject(2)
        .fadeOut(200)
        .filter("ColorMatrix", { hue: hue2 })

        .effect()
        .file(animation3)
        .delay(1400)
        .attachTo(template)
        .scaleToObject(1.66)
        .fadeIn(1000)
        .fadeOut(1500)
        .persist()
        .name(`Cloud of Daggers`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cloudOfDaggers.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.cloudOfDaggers?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.cloudOfDaggers.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Cloud of Daggers: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    let damageDice = trigger.castLevel * 2;
    featureData.system.damage.parts = [[damageDice + 'd4[piercing]', 'piercing']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(token)
        .scaleToObject(1.8)
        .delay(100)
        .duration(2500)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .belowTokens()

        .play()
}

export let cloudOfDaggers = {
    'item': item,
    'trigger': trigger,
    'enter': enter
}