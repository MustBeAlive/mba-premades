import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} WraSmi` })
        let targetEffect = await fromUuid(effect.flags['mba-premades']?.spell?.wrathfulSmite?.targetEffectUuid);
        if (!targetEffect) return;
        let target = await fromUuid(effect.flags['mba-premades']?.spell?.wrathfulSmite?.targetUuid);
        if (!target) return;
        Sequencer.EffectManager.endEffects({ name: `${target.name} WraSmi` })
        await mbaPremades.helpers.removeEffect(targetEffect);
    };
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
                'value': 'function.mbaPremades.macros.wrathfulSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'wrathfulSmite': {
                        'saveDC': mba.getSpellDC(workflow.item),
                        'level': workflow.castData.castLevel,
                        'used': false
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.02.03`)
        .attachTo(workflow.token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .delay(500)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .playbackRate(2)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .file("jb2a.divine_smite.caster.reversed.purplepink")
        .attachTo(workflow.token)
        .scaleToObject(2.2)
        .delay(1050)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.purplepink")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.purple.007")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} WraSmi`)

        .thenDo(async () => {
            let effect = await mba.createEffect(workflow.actor, effectData);
            let updates = { 'flags.mba-premades.spell.wrathfulSmite.targetEffectUuid': effect.uuid };
            await mba.updateEffect(effect, updates);
        })

        .play();
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.wrathfulSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    let queueSetup = await queue.setup(workflow.item.uuid, 'wrathfulSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d6[psychic]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Wrathful Smite: Save", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    let saveDC = effect.flags['mba-premades'].spell.wrathfulSmite.saveDC;
    featureData.system.save.dc = saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .file("jb2a.impact.ground_crack.purple.01")
        .atLocation(target)
        .size(2.3 * workflow.token.document.width, { gridUnits: true })
        .delay(300)
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.purplepink")
        .atLocation(target)
        .rotateTowards(workflow.token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * workflow.token.document.width, y: -0 * workflow.token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} WraSmi` })
        })

        .play()

    if (featureWorkflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.purple.007")
            .atLocation(target)
            .attachTo(target)
            .scaleToObject(2)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} WraSmi`)

            .play();

        async function effectMacroDel() {
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} WraSmi` });
            await mbaPremades.helpers.removeEffect(originEffect);
        }
        const effectData = {
            'name': 'Wrathful Smite: Fear',
            'icon': effect.icon,
            'origin': effect.uuid,
            'description': `
                <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Wrathul Smite.</p>
                <p>As an action, you can make a Wisdom ability check to steel your resolve and end this effect on a success.</p>
            `,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Frightened',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=check, saveAbility=wis, saveDC=${saveDC}, saveMagic=true, name=Fear: Action Save (DC${saveDC}), killAnim=true`,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'specialDuration': ["zeroHP"]
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 1,
                        castLevel: effect.flags['midi-qol'].castData.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };
        let targetEffect = await mba.createEffect(target.actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'wrathfulSmite': {
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

export let wrathfulSmite = {
    'damage': damage,
    'item': item
}