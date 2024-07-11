import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} SeaSmi` });
        let targetEffect = await fromUuid(effect.flags['mba-premades']?.spell?.searingSmite?.targetEffectUuid);
        if (!targetEffect) return;
        let target = await fromUuid(effect.flags['mba-premades']?.spell?.searingSmite?.targetUuid);
        if (!target) return;
        Sequencer.EffectManager.endEffects({ name: `${target.name} SeaSmi` })
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
                'value': 'function.mbaPremades.macros.searingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'searingSmite': {
                        'saveDC': mba.getSpellDC(workflow.item),
                        'level': workflow.castData.castLevel,
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
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file(`jb2a.particles.outward.orange.02.03`)
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
        .file("jb2a.divine_smite.caster.reversed.orange")
        .attachTo(workflow.token)
        .scaleToObject(2.2)
        .delay(1050)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.orange")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.orange.007")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} SeaSmi`)

        .play();

    let effect = await mba.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.searingSmite.targetEffectUuid': effect.uuid };
    await mba.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.searingSmite);
    if (!effect) return;
    if (effect.flags['mba-premades'].spell.searingSmite.used) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'searingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades']?.spell?.searingSmite?.level + 'd6[fire]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let saveDC = effect.flags['mba-premades'].spell.searingSmite.saveDC;
    async function effectMacroDel() {
        let originEffect = await fromUuid(effect.origin);
        if (!originEffect) return;
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} SeaSmi` });
        await mbaPremades.helpers.removeEffect(originEffect);
    }
    let effectData = {
        'name': 'Searing Smite: Burn',
        'icon': effect.icon,
        'origin': effect.uuid,
        'description': `
            <p>You are burning. Until the spell ends, you must make a Constitution saving throw at the start of each of your turns.</p>
            <p>On a failed save, you take 1d6 fire damage. On a successful save, the spell ends.</p>
            <p>If you or a creature within 5 feet of you uses its action to put out the flames, or if some other effect douses the flames (such as being submerged in water), the spell ends.</p>
        `,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageBeforeSave=false, saveAbility=con, saveDC=${saveDC}, saveMagic=true, damageType=fire, damageRoll=1d6, name=Searing Smite: Burn (DC${saveDC}), killAnim=true, fastForwardDamage=true`,
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
                    baseLevel: 1,
                    castLevel: effect.flags['midi-qol'].castData.castLevel,
                    itemUuid: effect.uuid
                }
            }
        }
    };
    let target = workflow.targets.first();
    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .delay(300)
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.orange")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} SeaSmi` })
        })

        .effect()
        .file("jb2a.flames.orange.03.1x1.0")
        .attachTo(target, { offset: { x: 0, y: -0.15 }, gridUnits: true })
        .scaleToObject(1.4)
        .belowTokens(false)
        .opacity(0.8)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} SeaSmi`)

        .thenDo(async () => {
            let targetEffect = await mba.createEffect(target.actor, effectData);
            let updates = {
                'flags': {
                    'mba-premades': {
                        'spell': {
                            'searingSmite': {
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
        })

        .play();
}

export let searingSmite = {
    'damage': damage,
    'item': item
}