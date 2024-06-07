import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Blinding Smite` })
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.blindingSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        let targetUuid = effect.flags['mba-premades']?.spell?.blindingSmite?.targetUuid;
        if (!targetUuid) return;
        let target = await fromUuid(targetUuid);
        await Sequencer.EffectManager.endEffects({ name: `${target.name} Blinding Smite` })
        await mbaPremades.helpers.removeEffect(targetEffect);
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.blindingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'blindingSmite': {
                        'saveDC': mba.getSpellDC(workflow.item),
                        'used': false
                    }
                }
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
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

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.white.02.03`)
        .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.yellowwhite")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.blue.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Blinding Smite`)

        .play();

    let effect = await mba.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.blindingSmite.targetEffectUuid': effect.uuid };
    await mba.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.blindingSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    let queueSetup = await queue.setup(workflow.item.uuid, 'blindingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '3d8[radiant]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Blinding Smite: Blind');
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.blindingSmite.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.impact.ground_crack.01.blue")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .filter("ColorMatrix", { saturate: -0.5, hue: -160 })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.yellowwhite")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Blinding Smite` })
        })

        .play();

    if (featureWorkflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.blue.007")
            .atLocation(target)
            .attachTo(target)
            .scaleToObject(2)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} Blinding Smite`)

            .play();

        async function effectMacroDel() {
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Blinding Smite` });
            await mbaPremades.helpers.removeEffect(originEffect);
        }
        let effectData = {
            'name': 'Blinding Smite: Blindness',
            'description': "You are blinded by Blinding Smite. At the end of each of your turns, you can make a Constitution Saving Throw. On a successful save, the spell ends and you are no longer blinded.",
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=end, saveAbility=con, saveDC=' + effect.flags['mba-premades'].spell.blindingSmite.saveDC + ', saveMagic=true, name=Blinding Smite: End Turn',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Blinded',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 0,
                        castLevel: effect.flags['midi-qol']?.castData?.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };
        let targetEffect = await mba.createEffect(workflow.targets.first().actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'blindingSmite': {
                            'used': true,
                            'targetUuid': target.document.uuid,
                            'targetEffectUuid': targetEffect.uuid
                        }
                    }
                }
            }
        };
        await mba.updateEffect(effect, updates);
        queue.remove(workflow.item.uuid);
        return;
    }
    await mba.removeEffect(effect);
    queue.remove(workflow.item.uuid);
}

export let blindingSmite = {
    'damage': damage,
    'item': item
}