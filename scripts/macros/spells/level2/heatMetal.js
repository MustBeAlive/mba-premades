import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function animation({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];

    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .atLocation(target, { offset: offset[2], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .file("jb2a.flames.orange.01")
        .delay(750)
        .fadeIn(500)
        .fadeOut(1000)
        .duration(4050)
        .atLocation(target, { offset: offset[2], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .delay(200)
        .atLocation(target, { offset: offset[0], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .delay(950)
        .file("jb2a.flames.orange.01")
        .fadeIn(500)
        .fadeOut(1000)
        .duration(3850)
        .atLocation(target, { offset: offset[0], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .delay(400)
        .atLocation(target, { offset: offset[3], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .delay(1150)
        .file("jb2a.flames.orange.01")
        .fadeIn(500)
        .fadeOut(1000)
        .duration(3650)
        .atLocation(target, { offset: offset[3], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .delay(600)
        .atLocation(target, { offset: offset[1], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .delay(1350)
        .file("jb2a.flames.orange.01")
        .fadeIn(500)
        .fadeOut(1000)
        .duration(3450)
        .atLocation(target, { offset: offset[1], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .delay(800)
        .atLocation(target, { offset: offset[4], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .delay(1550)
        .file("jb2a.flames.orange.01")
        .fadeIn(500)
        .fadeOut(1000)
        .duration(3250)
        .atLocation(target, { offset: offset[4], gridUnits: true, followRotation: false })
        .scaleToObject(1)

        .effect()
        .delay(1800)
        .fadeIn(300)
        .file("animated-spell-effects-cartoon.fire.spiral")
        .attachTo(target)
        .scaleToObject(1.5)

        .effect()
        .file("jb2a.cast_generic.fire.01.orange.0")
        .delay(2350)
        .fadeIn(300)
        .attachTo(target)
        .scaleToObject(1.8)
        .waitUntilFinished(-1400)

        .effect()
        .file("jb2a.token_border.circle.spinning.orange.005")
        .attachTo(target)
        .scaleToObject(2)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .opacity(0.9)
        .fadeIn(500)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} Heat Metal`)

        .play()
}

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();
    let damageDice = workflow.castData.castLevel + 'd8[fire]';
    let targetUuid = target.document.uuid;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Heat Metal: Pulse', false);
    if (!featureData) return;
    let spellDC = mba.getSpellDC(workflow.item);
    featureData.flags['mba-premades'] = {
        'spell': {
            'heatMetal': {
                'damageDice': damageDice,
                'targetUuid': targetUuid,
                'spellDC': spellDC,
                'originUuid': workflow.item.uuid
            },
            'castData': workflow.castData
        }
    };
    featureData.flags['mba-premades'].spell.castData.school = workflow.item.system.school;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Heat Metal` })
        await warpgate.revert(token.document, 'Heat Metal');
        await mbaPremades.macros.heatMetal.del(effect);
    }
    let effectDataSource = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'heatMetal': {
                        'targetUuid': targetUuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectDataSource.name]: effectDataSource
            }
        }
    };
    let options = {
        'permanent': false,
        'name': effectDataSource.name,
        'description': featureData.name,
        'origin': workflow.item.uuid
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    let effectDataTarget = {
        'name': 'Heat Metal: Dialogue',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 6
        },
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': 'await mbaPremades.macros.heatMetal.dialogue(token, actor, effect, origin);'
                }
            },
            'mba-premades': {
                'spell': {
                    'heatMetal': {
                        'spellDC': spellDC,
                        'originUuid': workflow.item.uuid
                    }
                }
            }
        }
    }
    await mba.createEffect(target.actor, effectDataTarget);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targetUuid = workflow.item.flags['mba-premades']?.spell?.heatMetal?.targetUuid;
    let damageDice = workflow.item.flags['mba-premades']?.spell?.heatMetal?.damageDice;
    let spellDC = workflow.item.flags['mba-premades']?.spell?.heatMetal?.spellDC;
    let originUuid = workflow.item.flags['mba-premades']?.spell?.heatMetal?.originUuid;
    if (!damageDice || !targetUuid || !spellDC || !originUuid) return;
    let target = await fromUuid(targetUuid);
    if (!target) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Heat Metal: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.damage.parts = [[damageDice, 'fire']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetUuid]);
    await MidiQOL.completeItemUse(feature, config, options);

    new Sequence()

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(target)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(target)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(target)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .play()

    let effectData = {
        'name': 'Heat Metal: Dialogue',
        'icon': workflow.item.img,
        'origin': originUuid,
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnStart']
            },
            'effectmacro': {
                'onCreate': {
                    'script': 'await mbaPremades.macros.heatMetal.dialogue(token, actor, effect, origin);'
                }
            },
            'mba-premades': {
                'spell': {
                    'heatMetal': {
                        'spellDC': spellDC,
                        'originUuid': originUuid
                    }
                }
            }
        }
    }
    await mba.createEffect(target.actor, effectData);
}

async function dialogue(token, actor, effect, origin) {
    await mba.playerDialogMessage(mba.firstOwner(token));
    let selection = await mba.dialog("Heat Metal", [['Yes (no save)', 'yes'], ['No/Unable (save)', 'no']], `<b>Do you want to drop the heated object?</b>`);
    await mba.clearPlayerDialogMessage();
    if (selection === "yes") {
        await effect.delete();
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Heat Metal: Disadvantage", false);
    if (!featureData) return;
    delete featureData._id;
    let spellDC = effect.flags['mba-premades']?.spell?.heatMetal?.spellDC;
    if (!spellDC) return;
    featureData.system.save.dc = spellDC;
    let spell = new CONFIG.Item.documentClass(featureData, { 'parent': origin.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let heatMetalWorkflow = await MidiQOL.completeItemUse(spell, config, options);
    if (!heatMetalWorkflow.failedSaves.size) {
        await effect.delete();
        return;
    }
    let originUuid = effect.flags['mba-premades']?.spell?.heatMetal?.originUuid;
    if (!originUuid) return;
    let effectData = {
        'name': 'Heat Metal: Disadvantage',
        'icon': origin.img,
        'origin': originUuid,
        'description': "You are holding/wearing red-hot object, which gives you disadvantage on all attack rolls and ability checks.",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                'mode': 2,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'transfer': false,
                'specialDuration': ['turnStartSource'],
                'stackable': 'multi',
                'macroRepeat': 'none'
            }
        }
    }
    await mba.createEffect(actor, effectData);
    await effect.delete();

    new Sequence()

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(token)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(token)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(token)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .play()
}

async function del(effect) {
    let targetUuid = effect.flags['mba-premades']?.spell?.heatMetal?.targetUuid;
    if (!targetUuid) return;
    let target = await fromUuid(targetUuid);
    if (!target) return;
    let targetEffect = mba.findEffect(target.actor, "Heat Metal: Disadvantage");
    if (!targetEffect) return;
    await mba.removeEffect(targetEffect);
}

export let heatMetal = {
    'animation': animation,
    'cast': cast,
    'item': item,
    'dialogue': dialogue,
    'del': del
}