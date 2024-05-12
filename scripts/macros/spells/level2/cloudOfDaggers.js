import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    let dagger = "jb2a.dagger.throw.01.red";
    let daggerScale = 0.4;
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
        .file(dagger)
        .attachTo(token, { offset: offset[2], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[2], gridUnits: true, followRotation: false })
        .scale(daggerScale)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 25 })
        .name(`${token.document.name} Dagger 3`)

        .effect()
        .file("jb2a.impact.orange.0")
        .delay(1100)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[2], gridUnits: true, followRotation: false })

        .effect()
        .file(dagger)
        .delay(100)
        .attachTo(token, { offset: offset[0], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[0], gridUnits: true, followRotation: false })
        .scale(daggerScale)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 25 })
        .name(`${token.document.name} Dagger 1`)

        .effect()
        .file("jb2a.impact.orange.0")
        .delay(1200)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[0], gridUnits: true, followRotation: false })

        .effect()
        .file(dagger)
        .delay(200)
        .attachTo(token, { offset: offset[3], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[3], gridUnits: true, followRotation: false })
        .scale(daggerScale)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 25 })
        .name(`${token.document.name} Dagger 4`)

        .effect()
        .file("jb2a.impact.orange.0")
        .delay(1300)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[3], gridUnits: true, followRotation: false })

        .effect()
        .file(dagger)
        .delay(300)
        .attachTo(token, { offset: offset[1], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[1], gridUnits: true, followRotation: false })
        .scale(daggerScale)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 25 })
        .name(`${token.document.name} Dagger 2`)

        .effect()
        .file("jb2a.impact.orange.0")
        .delay(1400)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[1], gridUnits: true, followRotation: false })

        .effect()
        .file(dagger)
        .delay(400)
        .attachTo(token, { offset: offset[4], gridUnits: true, followRotation: false })
        .stretchTo(template, { offset: offset[4], gridUnits: true, followRotation: false })
        .scale(daggerScale)
        .fadeIn(200)
        .filter("ColorMatrix", { hue: 25 })
        .name(`${token.document.name} Dagger 5`)

        .effect()
        .file("jb2a.impact.orange.0")
        .delay(1500)
        .scaleToObject(2)
        .attachTo(template, { offset: offset[4], gridUnits: true, followRotation: false })

        .effect()
        .file("animated-spell-effects-cartoon.misc.spark")
        .delay(1400)
        .attachTo(template)
        .scaleToObject(2)
        .fadeOut(200)

        .effect()
        .file("jb2a.cloud_of_daggers.daggers.yellow")
        .delay(1400)
        .attachTo(template)
        .scaleToObject(1.66)
        .fadeIn(1000)
        .fadeOut(1500)
        .persist()
        .name(`Cloud of Daggers`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'cloudOfDaggers',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'macroName': 'cloudOfDaggers',
                    'templateUuid': template.uuid,
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid
                }
            }
        }
    });
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
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Cloud of Daggers: Damage', false);
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
        .delay(100)
        .attachTo(token)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * token.document.texture.scaleX)
        .duration(2500)
        .fadeOut(1000)
        .belowTokens()

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cloudOfDaggers.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: `Cloud of Daggers` })
}

export let cloudOfDaggers = {
    'cast': cast,
    'item': item,
    'trigger': trigger,
    'enter': enter,
    'del': del
}