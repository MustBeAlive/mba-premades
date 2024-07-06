import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.enchantment.complete.pink")
        .attachTo(target)
        .scaleToObject(2)
        .fadeOut(1000)
        .belowTokens()

        .wait(2500)

        .effect()
        .file(workflow.item.img)
        .attachTo(target)
        .scaleToObject(0.9)
        .duration(7000)
        .fadeIn(1000)
        .fadeOut(1000)

        .play()

    if (mba.checkTrait(target.actor, "ci", "charmed")) await mba.createEffect(i.actor, constants.immunityEffectData);
    else if (mba.inCombat()) await mba.createEffect(target.actor, constants.advantageEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Dominate: Assume Control", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Dominate Monster: Assume Control";
    featureData.img = workflow.item.img;
    setProperty(featureData, "flags.midi-qol.onUseMacroName", "[postActiveEffects]function.mbaPremades.macros.dominateMonster.control");
    let castLevel = workflow.castData.castLevel;
    let duration;
    switch (castLevel) {
        case 8: duration = 3600; break;
        case 9: duration = 28800; break;
    }
    async function effectMacroDelSource() {
        await warpgate.revert(token.document, "Dominate Monster");
    };
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DomMon` });
        let casterDoc = await fromUuid(effect.flags['mba-premades']?.spell?.dominateMonster?.casterUuid);
        if (!casterDoc) return;
        let originEffect = await mbaPremades.helpers.findEffect(casterDoc.actor, "Concentrating"); //overly cautious?
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
        let controlEffect = await mbaPremades.helpers.findEffect(token.actor, "Dominate Monster: Lost Control");
        if (controlEffect) await mbaPremades.helpers.removeEffect(controlEffect);
    }
    let effectDataSource = {
        'name': "Dominate Monster",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Target: <u>${target.document.name}</u></p>
            <p>While the target is charmed, you have a telepathic link with it, as long as the two of you are on the same plane of existence.</p>
            <p>You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey.</p>
            <p>You can specify a simple and general course of action, such as "Attack that creature," "Run over there," or "Fetch that object".</p>
            <p>If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability.</p>
            <p>You can use your action to take total and precise control of the target.</p>
            <p>Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.</p>
        `,
        'duration': duration,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'spell': {
                    'dominateMonster': {
                        'targetUuid': target.document.uuid
                    }
                }
            },
        }
    };
    let effectDataTarget = {
        'name': "Dominate Monster: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>While you are charmed, you have a telepathic link with the caster of this spell, as long as the two of you are on the same plane of existence.</p>
            <p>Caster can use this telepathic link to issue commands to you, and you must do your best to obey them.</p>
            <p>If you complete the order and doesn't receive further direction from the caster of this spell, you defend and preserv yoursefl to the best of your ability.</p>
            <p>Each time you take damage, you can make a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.</p>
        `,
        'duration': {
            'seconds': duration
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Charmed",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.dominateMonster.damaged,isDamaged',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'spell': {
                    'dominateMonster': {
                        'casterUuid': workflow.token.document.uuid,
                        'saveDC': mba.getSpellDC(workflow.item),
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 8,
                    castLevel: castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectDataSource.name]: effectDataSource
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Dominate Monster",
        'description': "Dominate Monster"
    };

    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.spinning.orange.006")
        .attachTo(target)
        .scaleToObject(1.8)
        .fadeIn(1000)
        .fadeOut(2000)
        .belowTokens()
        .filter("ColorMatrix", { hue: 335 })
        .persist()
        .name(`${target.document.name} DomMon`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            await mba.createEffect(target.actor, effectDataTarget);
        })

        .play()
}

async function damaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(token.actor, "Dominate Monster: Target");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Dominate Monster: Target)");
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Dominate: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Dominate Monster: Save";
    featureData.img = effect.icon;
    featureData.system.save.dc = effect.flags['mba-premades']?.spell?.dominateMonster?.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

async function control({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Dominate Monster");
    if (!effect) {
        ui.notifications.warn("Unable to find the effect! (Dominate Monster)");
        return;
    }
    let targetDoc = await fromUuid(effect.flags['mba-premades']?.spell?.dominateMonster?.targetUuid);
    let target = targetDoc.object;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DomMAC` })
    };
    let effectData = {
        'name': "Dominate Monster: Lost Control",
        'icon': "modules/mba-premades/icons/generic/generic_control.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You've lost control over your actions.</p>
            <p>Until the end of caster's next turn, you only take the actions he or she chooses, and are unable to do anything that caster doesn't allow you to do.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.energy_beam.normal.red.03")
        .attachTo(workflow.token)
        .stretchTo(target)
        .duration(4000)
        .fadeOut(1000)
        .scaleIn(0, 2000)
        .playbackRate(0.8)
        .waitUntilFinished(-2500)

        .effect()
        .file("jb2a.markers.heart.dark_red.01")
        .attachTo(target)
        .scaleToObject(2)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(2000)
        .zIndex(2)

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.heart.dark_red")
        .attachTo(target)
        .scaleToObject(2.5)
        .fadeIn(1000)
        .fadeOut(2000)
        .zIndex(1)
        .playbackRate(0.8)
        .mask()
        .persist()
        .name(`${targetDoc.name} DomMAC`)

        .wait(250)

        .thenDo(async () => {
            await mba.createEffect(targetDoc.actor, effectData);
        })

        .play()
}

export let dominateMonster = {
    'cast': cast,
    'item': item,
    'damaged': damaged,
    'control': control
}